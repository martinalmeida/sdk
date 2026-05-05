import { useState, useEffect } from "preact/hooks";
import {
  programs,
  programsLoading,
  programsError,
  Program,
} from "../stores/programsStore";
import { programsApi } from "../services";

export function usePrograms() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);

  //Form fields
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
      alert("Nombre y slug son obligatorios");
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
    let res;
    if (editing) {
      res = await programsApi.updateProgram(editing.id, payload);
    } else {
      res = await programsApi.createProgram(payload);
    }
    if (!res.error) {
      await loadPrograms();
      setOpenModal(false);
      resetForm();
    } else {
      alert(res.error);
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
      } else {
        alert(res.error);
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
