import Head from 'next/head';
import BusinessInfoForm from '../components/BusinessInfoForm';
import BusinessInfoTable from '@/components/BusinessInfoTable';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Business Info Management</title>
      </Head>
      <main>
        <h1>Gestionar Información del Negocio</h1>
        <BusinessInfoTable />
      </main>
    </div>
  );
}
