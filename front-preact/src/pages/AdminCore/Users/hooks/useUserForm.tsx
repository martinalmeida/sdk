import { useState, useEffect } from "preact/hooks";
import { usersApi } from "../services/usersApi";
import { catalogsApi } from "../services/catalogsApi";
import { programs as programsSignal } from "../stores/programsStore";
import { roles as rolesSignal } from "../stores/rolesStore";
import { positions as positionsSignal } from "../stores/positionsStore";
import { pushToast } from "../../../../tools/alerts";

export interface AssignedProgram {
  program_id: number;
  role_id: number;
  is_active: boolean;
}

export function useUserForm(onSuccess: () => void) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [positionId, setPositionId] = useState("");
  const [status, setStatus] = useState("active");
  const [assignedPrograms, setAssignedPrograms] = useState<AssignedProgram[]>(
    [],
  );

  const loadCatalogs = async () => {
    const [progRes, rolesRes, posRes] = await Promise.all([
      catalogsApi.getPrograms(),
      catalogsApi.getRoles(),
      catalogsApi.getPositions(),
    ]);
    if (progRes.data) programsSignal.value = progRes.data;
    if (rolesRes.data) rolesSignal.value = rolesRes.data;
    if (posRes.data) positionsSignal.value = posRes.data;
  };

  useEffect(() => {
    if (open) loadCatalogs();
  }, [open]);

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
      setName(editingUser.name);
      setEmail(editingUser.email);
      setPositionId(editingUser.position?.id?.toString() || "");
      setStatus(editingUser.status);
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

    if (password && password !== passwordConfirmation) {
      pushToast("Las contraseñas no coinciden", "warning");
      setLoading(false);
      return;
    }

    const payload: any = {
      name,
      email,
      position_id: positionId ? parseInt(positionId) : null,
      status,
    };

    if (password) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    let res;
    if (editingUser) {
      res = await usersApi.updateUser(editingUser.id, payload);
      if (!res.error && assignedPrograms.length > 0) {
        for (const prog of assignedPrograms) {
          await usersApi.assignProgram(
            editingUser.id,
            prog.program_id,
            prog.role_id,
            prog.is_active,
          );
        }
      }
    } else {
      res = await usersApi.createUser(payload);
    }

    if (!res.error) {
      setOpen(false);
      onSuccess();
      pushToast(
        editingUser
          ? "Usuario actualizado correctamente"
          : "Usuario creado correctamente",
        "success",
      );
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
