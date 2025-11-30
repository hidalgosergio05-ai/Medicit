"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/format"
import { Plus, Eye, Check, X, Trash2, Calendar } from "lucide-react"
import Link from "next/link"
import type { Cita, Estado } from "@/lib/types"

export default function CitasPage() {
  const { user, isPaciente, isMedico, isAdmin, canCreate, canEdit, canDelete } = useAuth()
  const { toast } = useToast()

  const [citas, setCitas] = useState<Cita[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; cita: Cita | null }>({
    open: false,
    cita: null,
  })
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    cita: Cita | null
    action: "aceptar" | "rechazar" | null
  }>({ open: false, cita: null, action: null })

  const loadCitas = async () => {
    try {
      let data: Cita[] = []

      if (isPaciente()) {
        data = await api.getCitasPorPaciente(user!.idUsuario)
      } else if (isMedico()) {
        data = await api.getCitasPorMedico(user!.idUsuario)
      } else {
        data = await api.getCitas()
      }

      const estadosData = await api.getEstados()
      setCitas(data)
      setEstados(estadosData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las citas",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCitas()
  }, [user])

  const getEstadoId = (nombreEstado: string) => {
    const estado = estados.find((e) => e.nombreEstado.toLowerCase() === nombreEstado.toLowerCase())
    return estado?.idEstado
  }

  const handleStatusChange = async () => {
    if (!actionDialog.cita || !actionDialog.action) return

    const nuevoEstado = actionDialog.action === "aceptar" ? "Aceptada" : "Rechazada"
    const estadoId = getEstadoId(nuevoEstado)

    if (!estadoId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `No se encontró el estado "${nuevoEstado}"`,
      })
      return
    }

    try {
      await api.actualizarCita(actionDialog.cita.idCita, {
        estado: { idEstado: estadoId },
      })
      toast({
        title: "Cita actualizada",
        description: `La cita ha sido ${nuevoEstado.toLowerCase()}`,
      })
      loadCitas()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la cita",
      })
    } finally {
      setActionDialog({ open: false, cita: null, action: null })
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.cita) return

    try {
      await api.eliminarCita(deleteDialog.cita.idCita)
      toast({
        title: "Cita cancelada",
        description: "La cita ha sido cancelada correctamente",
      })
      loadCitas()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cancelar la cita",
      })
    } finally {
      setDeleteDialog({ open: false, cita: null })
    }
  }

  const filterCitasByStatus = (status: string) => {
    if (status === "todas") return citas
    return citas.filter((c) => c.estado.nombreEstado.toLowerCase() === status.toLowerCase())
  }

  const baseColumns = [
    {
      key: "fechaHora",
      header: "Fecha y hora",
      render: (cita: Cita) => formatDateTime(cita.fechaHora),
    },
    { key: "motivo", header: "Motivo" },
    {
      key: "estado",
      header: "Estado",
      render: (cita: Cita) => <StatusBadge status={cita.estado.nombreEstado} />,
    },
  ]

  const pacienteColumns = [
    ...baseColumns.slice(0, 1),
    {
      key: "medico",
      header: "Médico",
      render: (cita: Cita) => `Dr. ${cita.medico.nombres} ${cita.medico.apellidos}`,
    },
    ...baseColumns.slice(1),
  ]

  const medicoColumns = [
    ...baseColumns.slice(0, 1),
    {
      key: "paciente",
      header: "Paciente",
      render: (cita: Cita) => `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    },
    ...baseColumns.slice(1),
  ]

  const adminColumns = [
    ...baseColumns.slice(0, 1),
    {
      key: "paciente",
      header: "Paciente",
      render: (cita: Cita) => `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    },
    {
      key: "medico",
      header: "Médico",
      render: (cita: Cita) => `Dr. ${cita.medico.nombres} ${cita.medico.apellidos}`,
    },
    ...baseColumns.slice(1),
  ]

  const columns = isPaciente() ? pacienteColumns : isMedico() ? medicoColumns : adminColumns

  const renderActions = (cita: Cita) => {
    const isPending = cita.estado.nombreEstado.toLowerCase() === "pendiente"
    const canCancel = isPending || cita.estado.nombreEstado.toLowerCase() === "aceptada"

    return (
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/citas/${cita.idCita}`}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver</span>
          </Link>
        </Button>

        {/* Doctor actions: Accept/Reject */}
        {isMedico() && isPending && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => setActionDialog({ open: true, cita, action: "aceptar" })}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Aceptar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setActionDialog({ open: true, cita, action: "rechazar" })}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Rechazar</span>
            </Button>
          </>
        )}

        {/* Cancel action */}
        {(isPaciente() || isAdmin()) && canCancel && canDelete("modulo_citas") && (
          <Button variant="ghost" size="icon" onClick={() => setDeleteDialog({ open: true, cita })}>
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Cancelar</span>
          </Button>
        )}
      </div>
    )
  }

  const title = isPaciente() ? "Mis Citas" : isMedico() ? "Citas de Mis Pacientes" : "Gestión de Citas"

  const description = isPaciente()
    ? "Gestiona tus citas médicas y solicita nuevas"
    : isMedico()
      ? "Revisa y gestiona las citas pendientes de tus pacientes"
      : "Administra todas las citas del sistema"

  return (
    <DashboardLayout title={title}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {(isPaciente() || (canCreate("modulo_citas") && isAdmin())) && (
            <Button asChild>
              <Link href="/dashboard/citas/crear">
                <Plus className="mr-2 h-4 w-4" />
                {isPaciente() ? "Solicitar cita" : "Nueva cita"}
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
              <TabsTrigger value="aceptada">Aceptadas</TabsTrigger>
              <TabsTrigger value="rechazada">Rechazadas</TabsTrigger>
              <TabsTrigger value="cancelada">Canceladas</TabsTrigger>
            </TabsList>

            {["todas", "pendiente", "aceptada", "rechazada", "cancelada"].map((status) => (
              <TabsContent key={status} value={status}>
                <DataTable
                  data={filterCitasByStatus(status)}
                  columns={columns}
                  isLoading={isLoading}
                  searchPlaceholder="Buscar por motivo..."
                  actions={renderActions}
                />
              </TabsContent>
            ))}
          </Tabs>

          {citas.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No hay citas registradas</p>
              {isPaciente() && (
                <Button asChild className="mt-4">
                  <Link href="/dashboard/citas/crear">Solicitar tu primera cita</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog (Accept/Reject) */}
      <ConfirmDialog
        open={actionDialog.open}
        onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}
        title={actionDialog.action === "aceptar" ? "Aceptar cita" : "Rechazar cita"}
        description={
          actionDialog.action === "aceptar"
            ? "¿Confirmas que deseas aceptar esta cita?"
            : "¿Confirmas que deseas rechazar esta cita?"
        }
        confirmText={actionDialog.action === "aceptar" ? "Aceptar" : "Rechazar"}
        variant={actionDialog.action === "rechazar" ? "destructive" : "default"}
        onConfirm={handleStatusChange}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="Cancelar cita"
        description="¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer."
        confirmText="Cancelar cita"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  )
}
