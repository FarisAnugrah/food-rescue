import { getConsumerOrders } from "@/lib/order-queries";
import OrdersClient from "./orders-client";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { data: orders } = await getConsumerOrders();

  return <OrdersClient initialOrders={orders || []} />;
}
