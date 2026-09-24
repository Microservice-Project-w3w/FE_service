import { ApiError } from "@/core/api";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import { accountantInvoicesApi } from "@/modules/invoices";
import type { AccountantDeposit, AccountantDepositHistory, AccountantDepositListData, AccountantDepositStatus, AccountantPayment, AccountantPaymentListData, AccountantPaymentStatus, RecordAccountantPaymentInput, UpdateAccountantPaymentInput } from "@/modules/payments/types/accountant-payment.types";
import type { CreateDepositInput } from "@/modules/payments/components/AccountantDepositCreateDialog";

interface PaymentDto { id:number; organizationId:number; branchId:number; customerId:number; invoiceId:number; amount:number; paymentMethod:"CASH"|"BANK_TRANSFER"|"QR"; transactionReference:string; status:"PENDING"|"SUCCESS"|"CANCELLED"|"REFUNDED"; paidAt:string }
interface DepositDto { id:number; organizationId:number; branchId:number; customerId:number; rentalOrderId:number; rentalContractId:number; amount:number; deductedAmount:number; refundedAmount:number; remainingAmount:number; paymentMethod:string; reference:string|null; notes:string|null; status:string; createdAt:string; updatedAt:string }
interface DepositHistoryDto { id:number; action:string; amount:number|null; oldStatus:string|null; newStatus:string|null; description:string|null; createdAt:string }
const requireList = <T,>(value:unknown, code:string):T[] => { if (!Array.isArray(value)) throw new ApiError("Unexpected billing list response", { code }); return value as T[]; };
const mapStatus = (status:PaymentDto["status"]):AccountantPaymentStatus => status === "CANCELLED" || status === "REFUNDED" ? "VOIDED" : status;
const mapMethod = (method:PaymentDto["paymentMethod"]) => method === "QR" ? "CARD" as const : method;

const getList = async ():Promise<AccountantPaymentListData> => {
  const [raw, invoiceData] = await Promise.all([authenticatedRequest<PaymentDto[]>("GET", "/api/v1/billing/payments"), accountantInvoicesApi.getList()]);
  const invoices = new Map(invoiceData.invoices.map((invoice) => [invoice.id, invoice]));
  const payments = requireList<PaymentDto>(raw, "PAYMENT_CONTRACT_INVALID").map((dto):AccountantPayment => {
    const invoice = invoices.get(String(dto.invoiceId));
    return { id:String(dto.id), invoiceId:String(dto.invoiceId), invoiceCode:invoice?.invoiceCode || `Invoice #${dto.invoiceId}`, customerName:invoice?.customerName || `Customer #${dto.customerId}`, branchId:String(dto.branchId), branchName:invoice?.branchName || `Branch #${dto.branchId}`, amount:Number(dto.amount), method:mapMethod(dto.paymentMethod), referenceCode:dto.transactionReference || null, paidAt:dto.paidAt, recordedBy:"Backend", status:mapStatus(dto.status), source:"MANUAL", note:null };
  });
  const successful = payments.filter((item) => item.status === "SUCCESS"); const today = new Date().toISOString().slice(0, 10);
  return { payments, payableInvoices:invoiceData.invoices.filter((invoice) => !["DRAFT","PAID","CANCELLED"].includes(invoice.status) && invoice.remainingAmount > 0), summary:{ collectedAmount:successful.reduce((sum,item)=>sum+item.amount,0), collectedToday:successful.filter((item)=>item.paidAt.startsWith(today)).reduce((sum,item)=>sum+item.amount,0), successCount:successful.length, pendingCount:payments.filter((item)=>item.status==="PENDING").length, failedOrVoidedCount:payments.filter((item)=>item.status==="VOIDED").length } };
};
const getById = async (id:string):Promise<AccountantPayment> => { const payment=(await getList()).payments.find((item)=>item.id===id); if(!payment) throw new ApiError("Payment not found",{code:"PAYMENT_NOT_FOUND"}); return payment; };
const record = async (input:RecordAccountantPaymentInput):Promise<AccountantPayment> => {
  const invoice=await accountantInvoicesApi.getById(input.invoiceId);
  if (!invoice.organizationId) throw new ApiError("Invoice organization is unavailable",{code:"PAYMENT_SCOPE_UNAVAILABLE"});
  if(input.method==="OTHER") throw new ApiError("Unsupported payment method",{code:"PAYMENT_METHOD_UNSUPPORTED"});
  const created=await authenticatedRequest<PaymentDto>("POST","/api/v1/billing/payments",{body:{organizationId:Number(invoice.organizationId),branchId:Number(invoice.branchId),customerId:Number(invoice.customerId),invoiceId:Number(input.invoiceId),amount:input.amount,paymentMethod:input.method==="CARD"?"QR":input.method,transactionReference:input.referenceCode||`PAY-${Date.now()}`,paidAt:input.paidAt}});
  await authenticatedRequest("POST",`/api/v1/billing/payments/${created.id}/confirm`); return getById(String(created.id));
};
const update=async(_input:UpdateAccountantPaymentInput):Promise<AccountantPayment>=>{throw new ApiError("Backend does not support editing payments",{code:"PAYMENT_UPDATE_UNSUPPORTED"});};
const voidPayment=async(id:string):Promise<void>=>{await authenticatedRequest("POST",`/api/v1/billing/payments/${id}/cancel`);};
const depositStatus=(dto:DepositDto):AccountantDepositStatus=>dto.status === "REFUNDED" ? "REFUNDED" : Number(dto.refundedAmount)>0 ? "PARTIALLY_REFUNDED" : Number(dto.deductedAmount)>0 ? "PARTIALLY_DEDUCTED" : Number(dto.remainingAmount)>0 ? "HELD" : "PENDING";
const getDeposits=async():Promise<AccountantDepositListData>=>{
  const raw=requireList<DepositDto>(await authenticatedRequest("GET","/api/v1/billing/deposits"),"DEPOSIT_CONTRACT_INVALID");
  const deposits=await Promise.all(raw.map(async(dto):Promise<AccountantDeposit>=>{
    const historyRaw=requireList<DepositHistoryDto>(await authenticatedRequest("GET",`/api/v1/billing/deposits/${dto.id}/history`),"DEPOSIT_HISTORY_CONTRACT_INVALID");
    const history:AccountantDepositHistory[]=historyRaw.map((item)=>({id:String(item.id),action:item.action,amount:item.amount===null?null:Number(item.amount),oldStatus:item.oldStatus,newStatus:item.newStatus,description:item.description,createdAt:item.createdAt}));
    return {id:String(dto.id),invoiceId:"",invoiceCode:"—",rentalCode:`Order #${dto.rentalOrderId}`,customerName:`Customer #${dto.customerId}`,branchName:`Branch #${dto.branchId}`,depositAmount:Number(dto.amount),deductedAmount:Number(dto.deductedAmount),heldAmount:Number(dto.amount)-Number(dto.deductedAmount),refundedAmount:Number(dto.refundedAmount),remainingAmount:Number(dto.remainingAmount),history,status:depositStatus(dto),updatedAt:dto.updatedAt};
  }));
  return {deposits,summary:{totalDeposit:deposits.reduce((s,x)=>s+x.depositAmount,0),heldAmount:deposits.reduce((s,x)=>s+x.remainingAmount,0),refundableAmount:deposits.reduce((s,x)=>s+x.remainingAmount,0),refundedAmount:deposits.reduce((s,x)=>s+x.refundedAmount,0)}};
};
const refundDeposit=async(depositId:string):Promise<void>=>{const dto=await authenticatedRequest<DepositDto>("GET",`/api/v1/billing/deposits/${depositId}`);await authenticatedRequest("POST",`/api/v1/billing/deposits/${depositId}/refund`,{body:{amount:Number(dto.remainingAmount),paymentMethod:"BANK_TRANSFER",reason:"Accountant refund"}});};
const deductDeposit=async(depositId:string,amount:number,reason:string):Promise<void>=>{await authenticatedRequest("POST",`/api/v1/billing/deposits/${depositId}/deductions`,{body:{amount,reason,referenceType:"ACCOUNTANT",referenceId:Number(depositId)}});};
const createDeposit=async(input:CreateDepositInput):Promise<void>=>{await authenticatedRequest("POST","/api/v1/billing/deposits",{body:input});};
export const accountantPaymentsApi={getList,getById,record,update,voidPayment,getDeposits,createDeposit,deductDeposit,refundDeposit};
