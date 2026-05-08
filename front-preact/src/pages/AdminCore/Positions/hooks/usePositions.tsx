import { useState, useEffect } from "preact/hooks";
import {
  positions,
  positionsLoading,
  positionsError,
} from "../stores/positionsStore";
import { positionsApi } from "../services/positionsApi";

export function usePositions() {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadPositions = async () => {
    positionsLoading.value = true;
    const res = await positionsApi.getPositions();
    if (res.data) positions.value = res.data;
    else positionsError.value = res.error || "Error al cargar cargos";
    positionsLoading.value = false;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = (pos: any) => {
    setName(pos.name);
    setDescription(pos.description || "");
    setEditing(pos);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!name) return;
    setLoadingSubmit(true);
    const payload = { name, description: description || null };
    let res;
    if (editing) {
      res = await positionsApi.updatePosition(editing.id, payload);
    } else {
      res = await positionsApi.createPosition(payload);
    }
    if (!res.error) {
      await loadPositions();
      setOpenModal(false);
      resetForm();
    } else {
      alert(res.error);
    }
    setLoadingSubmit(false);
  };

  const deletePosition = async (id: number) => {
    if (confirm("¿Eliminar este cargo?")) {
      const res = await positionsApi.deletePosition(id);
      if (!res.error) await loadPositions();
      else alert(res.error);
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  return {
    positions: positions.value,
    loading: positionsLoading.value,
    error: positionsError.value,
    openModal,
    setOpenModal,
    editing,
    name,
    setName,
    description,
    setDescription,
    loadingSubmit,
    handleSubmit,
    openCreate,
    openEdit,
    deletePosition,
  };
}
