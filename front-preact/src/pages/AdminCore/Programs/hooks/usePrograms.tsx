import { useState, useEffect } from "preact/hooks";
import {
  programs,
  programsLoading,
  programsError,
  Program,
} from "../stores/programsStore";
import { programsApi } from "../services";
import { pushToast } from "../../../../tools/alerts";

export function usePrograms() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("0.1");
  const [isActive, setIsActive] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadPrograms = async () => {
    programsLoading.value = true;
    const res = await programsApi.getPrograms();
    if (res.data) {
      programs.value = res.data;
    } else {
      programsError.value = res.error || "Error al cargar programas";
    }
    programsLoading.value = false;
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setVersion("0.1");
    setIsActive(true);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = (program: Program) => {
    setName(program.name);
    setSlug(program.slug);
    setDescription(program.description || "");
    setVersion(program.version);
    setIsActive(program.is_active);
    setEditing(program);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!name || !slug) {
      pushToast("Nombre y slug son obligatorios", "warning");
      return;
    }
    setLoadingSubmit(true);
    const payload = {
      name,
      slug,
      description: description || null,
      version,
      is_active: isActive,
    };
    const res = editing
      ? await programsApi.updateProgram(editing.id, payload)
      : await programsApi.createProgram(payload);

    if (!res.error) {
      await loadPrograms();
      setOpenModal(false);
      resetForm();
      pushToast(
        editing
          ? "Programa actualizado correctamente"
          : "Programa creado correctamente",
        "success",
      );
    }
    setLoadingSubmit(false);
  };

  const deleteProgram = async (id: number) => {
    if (
      confirm(
        "¿Eliminar este programa? Se perderán roles y permisos asociados.",
      )
    ) {
      const res = await programsApi.deleteProgram(id);
      if (!res.error) {
        await loadPrograms();
        pushToast("Programa eliminado correctamente", "success");
      }
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);

  return {
    programs: programs.value,
    loading: programsLoading.value,
    error: programsError.value,
    openModal,
    setOpenModal,
    editing,
    name,
    setName,
    slug,
    setSlug,
    description,
    setDescription,
    version,
    setVersion,
    isActive,
    setIsActive,
    loadingSubmit,
    handleSubmit,
    openCreate,
    openEdit,
    deleteProgram,
  };
}
