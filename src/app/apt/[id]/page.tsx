import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApartmentDetailView from '@/components/ApartmentDetailView';
import rawApartments from '@/data/apartments.json';
import { Apartment } from '@/types/apartment';

const apartments = rawApartments as Apartment[];

export async function generateStaticParams() {
  return apartments.map((apt) => ({
    id: apt.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apt = apartments.find((a) => a.id === id);
  if (!apt) return { title: '단지를 찾을 수 없습니다' };

  return {
    title: `${apt.name} 분양가·안전마진 & 팩트 리포트 - 쓱보는 청약`,
    description: `${apt.name} 분양가, 시세 대비 안전마진, 바름 팩트 및 단호 리스크 분석 리포트`,
  };
}

export default async function ApartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apt = apartments.find((a) => a.id === id);

  if (!apt) {
    notFound();
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <ApartmentDetailView apt={apt} />
      <Footer />
    </div>
  );
}
