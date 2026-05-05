import { useState, useEffect } from "preact/hooks";
import { usersApi } from "../services/usersApi";
import { catalogsApi } from "../services/catalogsApi";
import { programs as programsSignal } from "../stores/programsStore";
import { roles as rolesSignal } from "../stores/rolesStore";
import { positions as positionsSignal } from "../stores/positionsStore";

export interface AssignedProgram {
  program_id: number;
  role_id: number;
  is_active: boolean;
}

export function useUserForm(onSuccess: () => void) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  //Estado del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [positionId, setPositionId] = useState("");
  const [status, setStatus] = useState("active");
  const [assignedPrograms, setAssignedPrograms] = useState<AssignedProgram[]>(
    [],
  );

  //Cargar catálogos si es necesario (ya se cargan en useUsers, pero por si acaso)
  useEffect(() => {
    if (open && programsSignal.value.length === 0) {
      catalogsApi.getPrograms().then((res) => {
        if (res.data) programsSignal.value = res.data;
      });
      catalogsApi.getRoles().then((res) => {
        if (res.data) rolesSignal.value = res.data;
      });
      catalogsApi.getPositions().then((res) => {
        if (res.data) positionsSignal.value = res.data;
      });
    }
  }, [open]);

  //Resetear formulario al abrir/cerrar
  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      setPositionId("");
      setStatus("active");
      setAssignedPrograms([]);
      setEditingUser(null);
    } else if (editingUser) {
      //Cargar datos del usuario para edición
      setName(editingUser.name);
      setEmail(editingUser.email);
      setPositionId(editingUser.position?.id?.toString() || "");
      setStatus(editingUser.status);
      //Cargar programas asignados (suponiendo que vienen en editingUser.programs)
      if (editingUser.programs) {
        setAssignedPrograms(
          editingUser.programs.map((p: any) => ({
            program_id: p.id,
            role_id: p.pivot.role_id,
            is_active: p.pivot.is_active,
          })),
        );
      }
    }
  }, [open, editingUser]);

  const addProgram = () => {
    if (programsSignal.value.length === 0) return;
    setAssignedPrograms([
      ...assignedPrograms,
      {
        program_id: programsSignal.value[0].id,
        role_id: rolesSignal.value[0]?.id || 0,
        is_active: true,
      },
    ]);
  };

  const updateAssignedProgram = (index: number, field: string, value: any) => {
    const updated = [...assignedPrograms];
    updated[index] = { ...updated[index], [field]: value };
    setAssignedPrograms(updated);
  };

  const removeProgram = (index: number) => {
    setAssignedPrograms(assignedPrograms.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !email) return;

    setLoading(true);
    const payload: any = {
      name,
      email,
      position_id: positionId ? parseInt(positionId) : null,
      status,
    };
    if (password) {
      if (password !== passwordConfirmation) {
        alert("Las contraseñas no coinciden");
        setLoading(false);
        return;
      }
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    let res;
    if (editingUser) {
      res = await usersApi.updateUser(editingUser.id, payload);
    } else {
      //En creación, el backend requiere al menos un programa y rol
      if (assignedPrograms.length === 0) {
        alert("Debe asignar al menos un programa al usuario");
        setLoading(false);
        return;
      }
      payload.program_id = assignedPrograms[0].program_id;
      payload.role_id = assignedPrograms[0].role_id;
      res = await usersApi.createUser(payload);
    }

    if (!res.error) {
      //Si hay programas asignados adicionales (solo para edición, ya que en creación solo uno)
      if (editingUser && assignedPrograms.length > 0) {
        //Sincronizar programas asignados (esto es más complejo, lo simplificamos)
        for (const prog of assignedPrograms) {
          await usersApi.assignProgram(
            editingUser.id,
            prog.program_id,
            prog.role_id,
            prog.is_active,
          );
        }
      }
      setOpen(false);
      onSuccess();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingUser(null);
    setOpen(true);
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setOpen(true);
  };

  const loadCatalogs = async () => {
    try {
      const [progRes, rolesRes, posRes] = await Promise.all([
        catalogsApi.getPrograms(),
        catalogsApi.getRoles(),
        catalogsApi.getPositions(),
      ]);
      if (progRes.data) programsSignal.value = progRes.data;
      else console.error("Error programas:", progRes.error);
      if (rolesRes.data) rolesSignal.value = rolesRes.data;
      else console.error("Error roles:", rolesRes.error);
      if (posRes.data) positionsSignal.value = posRes.data;
      else console.error("Error cargos:", posRes.error);
    } catch (err) {
      console.error("Error cargando catálogos", err);
    }
  };

  useEffect(() => {
    if (open) {
      loadCatalogs();
    }
  }, [open]);

  return {
    open,
    setOpen,
    loading,
    editingUser,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    positionId,
    setPositionId,
    status,
    setStatus,
    assignedPrograms,
    addProgram,
    updateAssignedProgram,
    removeProgram,
    handleSubmit,
    openCreate,
    openEdit,
  };
}
