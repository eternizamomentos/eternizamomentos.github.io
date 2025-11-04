import Layout from "../components/Layout";
import PaymentForm from "../components/PaymentForm";

export default function Pagar() {
  return (
    <Layout>
      <main className="container-page py-16">
        <h1 className="text-3xl font-bold text-center mb-10 text-[#101828]">
          Finalize seu pedido 🎵
        </h1>
        <p className="text-center text-[#667085] mb-8">
          Escolha a forma de pagamento segura via Pagar.me
        </p>
        <PaymentForm />
      </main>
    </Layout>
  );
}
