"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type ImovelCreationDto, ImovelStatus, ImovelTipo, type PredioDto, imovelApi, predioApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { NumberInput } from "@/components/ui/number-input"
import { CurrencyInput } from "@/components/ui/currency-input"

export default function ImovelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const id = params.id as string
  const isNew = id === "novo"
  const predioIdParam = searchParams.get("predioId")

  const [imovel, setImovel] = useState<ImovelCreationDto>({
    apto: "",
    status: ImovelStatus.DISPONIVEL,
    tamanho: 0,
    tipo: ImovelTipo.APTO_1_DORM,
    predioId: predioIdParam ? Number.parseInt(predioIdParam) : 0,
    valor: 0,
    observacao: "",
  })

  const [predios, setPredios] = useState<PredioDto[]>([])
  const [tiposImovel, setTiposImovel] = useState<ImovelTipo[]>([])
  const [statusImovel, setStatusImovel] = useState<ImovelStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [valorCentavos, setValorCentavos] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar prédios
        const prediosData = await predioApi.getAll()
        setPredios(prediosData)

        // Buscar tipos de imóvel
        const tiposData = await imovelApi.getTipos()
        setTiposImovel(tiposData)

        // Buscar status de imóvel
        const statusData = await imovelApi.getStatus()
        setStatusImovel(statusData)

        // Se for edição, buscar dados do imóvel
        if (!isNew) {
          const imovelData = await imovelApi.getById(Number.parseInt(id))
          console.log(imovelData)
          setValorCentavos((imovelData.valor || 0) * 100)
          setImovel({
            apto: imovelData.apto,
            status: imovelData.status,
            tamanho: imovelData.tamanho,
            tipo: imovelData.tipo,
            predioId: imovelData.predio.id,
            valor: imovelData.valor || 0,
            observacao: imovelData.observacao || "",
          })

          // Converter o valor para centavos para o componente CurrencyInput
        } else if (predioIdParam && !imovel.predioId) {
          // Se for novo e tiver predioId no parâmetro, definir
          setImovel((prev) => ({
            ...prev,
            predioId: Number.parseInt(predioIdParam),
          }))
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários.",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isNew, predioIdParam, toast])

  useEffect(() => {
    if(!isNew && imovel.valor !== undefined) {
      setValorCentavos((imovel.valor || 0) * 100)
    }
    
  }, [imovel.valor, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Converter o valor de centavos para reais antes de enviar
      const imovelToSave = {
        ...imovel,
        valor: valorCentavos / 100,
      }

      if (isNew) {
        await imovelApi.create(imovelToSave)
        toast({
          title: "Sucesso",
          description: "Imóvel criado com sucesso.",
        })
      } else {
        await imovelApi.update(Number.parseInt(id), imovelToSave)
        toast({
          title: "Sucesso",
          description: "Imóvel atualizado com sucesso.",
        })
      }

      // Redirecionar para a lista de imóveis do prédio se veio de lá
      if (predioIdParam) {
        router.push(`/imoveis?predioId=${predioIdParam}`)
      } else {
        router.push("/imoveis")
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: isNew ? "Não foi possível criar o imóvel." : "Não foi possível atualizar o imóvel.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-12">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Novo Imóvel" : "Editar Imóvel"}</h1>
          <p className="text-muted-foreground">
            {isNew ? "Preencha os dados para criar um novo imóvel." : "Atualize os dados do imóvel."}
          </p>
        </div>
        <Link href={predioIdParam ? `/imoveis?predioId=${predioIdParam}` : "/imoveis"}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Imóvel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="apto">Apartamento/Sala</Label>
                <Input
                  id="apto"
                  value={imovel.apto}
                  onChange={(e) => setImovel({ ...imovel, apto: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="predioId">Prédio</Label>
                <Select
                  value={imovel.predioId.toString()}
                  onValueChange={(value) => setImovel({ ...imovel, predioId: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um prédio" />
                  </SelectTrigger>
                  <SelectContent>
                    {predios.map((predio) => (
                      <SelectItem key={predio.id} value={predio.id.toString()}>
                        {predio.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={imovel.tipo}
                  onValueChange={(value) => setImovel({ ...imovel, tipo: value as ImovelTipo })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposImovel.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={imovel.status}
                  onValueChange={(value) => setImovel({ ...imovel, status: value as ImovelStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusImovel.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tamanho">Tamanho (m²)</Label>
                <NumberInput
                  id="tamanho"
                  value={imovel.tamanho}
                  onChange={(value) => setImovel({ ...imovel, tamanho: value || 0 })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="valor">Valor (R$)</Label>
                <CurrencyInput id="valor" value={valorCentavos} onChange={setValorCentavos} required />
              </div>
            </div>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                value={imovel.observacao || ""}
                onChange={(e) => setImovel({ ...imovel, observacao: e.target.value })}
                rows={4}
              />
            </div>

            <Button type="submit" disabled={loading} className="mt-4 w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {isNew ? "Criar Imóvel" : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
