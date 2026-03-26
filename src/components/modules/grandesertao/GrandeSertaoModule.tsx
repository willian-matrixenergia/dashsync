"use client";

import { useState, useEffect } from "react";
import { GDKpiTable } from "@/src/components/modules/gd/GDKpiTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { GDKpiRow } from "@/src/types/energy";

export function GrandeSertaoModule() {
  const [data, setData] = useState<GDKpiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch('/api/grandesertao');
        if (!res.ok) {
          throw new Error('Erro ao carregar dados de Grande Sertão II.');
        }
        const json = await res.json();
        setData(json.data);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full p-6 space-y-4 bg-background">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="flex-1 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive font-bold text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const now = new Date();
  const getWeekStr = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '').replace(' de ', '');
  };
  
  const currentWeekDate = new Date(now);
  const previousWeekDate = new Date(now);
  previousWeekDate.setDate(now.getDate() - 7);

  const headerMonth = now.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '').replace(' de ', ' - ');

  return (
    <div className="flex flex-col h-full w-full overflow-auto text-card-foreground font-sans bg-background pb-8 animate-in fade-in duration-500">
      {/* Header section superior - Dark */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#151B1C] border-b-4 border-primary">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            GRANDE SERTÃO II
          </h2>
          <span className="text-white/50 mx-2 text-xl font-light">|</span>
          <span className="text-white/80 text-sm tracking-wide">
            Semana {getWeekStr(currentWeekDate)} vs. Semana {getWeekStr(previousWeekDate)} <span className="italic font-light text-xs opacity-80">(operação 7 dias na semana)</span>
          </span>
        </div>
        <div className="text-primary font-bold tracking-widest text-sm capitalize">
          {headerMonth}
        </div>
      </div>

      <div className="p-4 lg:p-6 w-full overflow-x-auto">
        <GDKpiTable data={data} />
      </div>
    </div>
  );
}