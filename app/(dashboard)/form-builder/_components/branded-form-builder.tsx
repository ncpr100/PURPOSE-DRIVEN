"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "qrcode";
import toast from "react-hot-toast";

// Import extracted modules to reduce bundle size
import { SMART_TEMPLATES, PRESET_FIELDS } from "./form-templates";
import { getPresetFieldIcon, getTemplateIcon } from "./form-icons";
import type { FormConfig, QRConfig, FormField } from "./form-types";
import QRCustomizationPanel from "./qr-customization-panel";
import { generateAdvancedQR, uploadImage } from "./qr-generator";

import {
  Trash2,
  Plus,
  Download,
  QrCode,
  Camera,
  Palette,
  Eye,
  Copy,
  Save,
  ArrowLeft,
  RefreshCcw,
  Loader2,
  Settings,
  ImageIcon,
  AlertTriangle,
  Upload,
  Archive,
  X,
  ChevronUp,
  ChevronDown,
  Type,
  AlignLeft,
  CheckSquare,
  ChevronDown as DropdownIcon,
  Circle,
  Hash,
  Mail,
  Phone,
  CalendarDays,
  Minus,
  Heading1,
  GripVertical,
  PanelRight,
  SlidersHorizontal,
} from "lucide-react";

export default function BrandedFormBuilder({
  churchId,
}: {
  churchId?: string;
}) {
  // AUTO-SAVE STATE
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasLocalDraft, setHasLocalDraft] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // FILE INPUT REFS (fixes Button-inside-Label file picker issue)
  const churchLogoInputRef = useRef<HTMLInputElement>(null);
  const formBgInputRef = useRef<HTMLInputElement>(null);

  // Form Configuration
  const [formConfig, setFormConfig] = useState<FormConfig>({
    title: "Formulario Personalizado",
    description: "Descripción del formulario",
    fields: [{ id: 1, label: "Nombre Completo", type: "text", required: true }],

    // Submit Button Defaults
    submitButtonText: "Enviar Formulario",
    submitButtonColor: "#2563eb",
    submitButtonTextColor: "#ffffff",

    // Church Branding Defaults
    primaryColor: "#2563eb", // Blue
    secondaryColor: "#10b981", // Green
    headerTextColor: "#1f2937", // Dark gray
    bodyTextColor: "#4b5563", // Medium gray
    fontFamily: "Inter, sans-serif",
    formBackgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    inputBorderColor: "#d1d5db",
    inputFocusColor: "#2563eb",

    // Typography sizing defaults
    titleFontSize: "24px",
    bodyFontSize: "14px",
    fieldLabelFontSize: "14px",
    inputFontSize: "14px",

    // Layout defaults
    borderRadius: "8px",
    formMaxWidth: "600px",
  });

  // QR Configuration
  const [qrConfig, setQRConfig] = useState<QRConfig>({
    size: 300,
    margin: 4,
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    dotType: "square",
    cornerType: "square",
    useGradient: false,
    gradientType: "linear",
    gradientColors: ["#000000", "#333333"],
    gradientAngle: 0,
    useBackgroundImage: false,
    backgroundOpacity: 100,
    logoSize: 20,
    logoOpacity: 100,
    logoMargin: 10,
    logoShape: "circle",
    logoBackgroundColor: "#ffffff",
    logoBackgroundOpacity: 100,
    eyeColor: "#000000",
    eyeBorderColor: "#000000",
    eyeShape: "square",
  });

  // UI State
  const [qrCodeUrl, setQRCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedForms, setSavedForms] = useState<any[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentFormSlug, setCurrentFormSlug] = useState<string | null>(null);

  // 3-PANEL WYSIWYG STATE
  const [selectedFieldId, setSelectedFieldId] = useState<
    number | string | null
  >(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [rightPanel, setRightPanel] = useState<"properties" | "style">(
    "properties",
  );

  // 🚀 AUTO-SAVE FUNCTIONALITY - NEVER LOSE YOUR WORK!
  // CRITICAL: Key is scoped to churchId to prevent cross-tenant draft leakage
  const AUTO_SAVE_KEY = churchId
    ? `form-builder-draft-${churchId}`
    : "form-builder-draft";

  // Refs that always hold latest state values — used by timeout callbacks to avoid stale closures
  const formConfigRef = useRef(formConfig);
  useEffect(() => {
    formConfigRef.current = formConfig;
  }, [formConfig]);
  const qrConfigRef = useRef(qrConfig);
  useEffect(() => {
    qrConfigRef.current = qrConfig;
  }, [qrConfig]);

  // Save to localStorage immediately (instant backup)
  const saveToLocalStorage = useCallback(
    (config: FormConfig, qrConfiguration: QRConfig) => {
      try {
        const draftData = {
          formConfig: config,
          qrConfig: qrConfiguration,
          timestamp: new Date().toISOString(),
          version: "1.0",
        };
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(draftData));
        setHasLocalDraft(true);
        console.log("💾 Auto-saved to localStorage"); // DEBUG
      } catch (error) {
        console.error("❌ Failed to save to localStorage:", error);
      }
    },
    [AUTO_SAVE_KEY],
  );

  // Restore from localStorage on page load
  const restoreFromLocalStorage = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem(AUTO_SAVE_KEY);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        const savedTime = new Date(draftData.timestamp);
        const hoursAgo = (Date.now() - savedTime.getTime()) / (1000 * 60 * 60);

        if (hoursAgo < 24) {
          // Only restore if less than 24 hours old
          setFormConfig(draftData.formConfig);
          setQRConfig(draftData.qrConfig);
          setLastSaved(savedTime);
          setHasUnsavedChanges(false);

          toast.success(
            `Borrador restaurado desde ${savedTime.toLocaleTimeString()}`,
          );
          console.log("✅ Draft restored from localStorage"); // DEBUG
          return true;
        } else {
          // Clear expired draft
          localStorage.removeItem(AUTO_SAVE_KEY);
        }
      }
      return false;
    } catch (error) {
      console.error("❌ Failed to restore from localStorage:", error);
      return false;
    }
  }, [AUTO_SAVE_KEY]);

  // Auto-save wrapper functions
  // FIXED: Use functional setState (prev =>) and refs to eliminate stale closure bug
  // that caused dropdown options to revert when added rapidly
  const updateFormConfig = useCallback(
    (updater: (prev: FormConfig) => FormConfig) => {
      setFormConfig((prev) => updater(prev));

      // Auto-save debounced — reads latest values from refs, never stale
      clearTimeout(autoSaveTimeoutRef.current);
      setHasUnsavedChanges(true);

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveToLocalStorage(formConfigRef.current, qrConfigRef.current);
        setIsAutoSaving(false);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }, 2000); // 2 second delay
    },
    [saveToLocalStorage],
  );

  const updateQRConfig = useCallback(
    (updater: (prev: QRConfig) => QRConfig) => {
      setQRConfig((prev) => updater(prev));

      // Auto-save debounced — reads latest values from refs, never stale
      clearTimeout(autoSaveTimeoutRef.current);
      setHasUnsavedChanges(true);

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveToLocalStorage(formConfigRef.current, qrConfigRef.current);
        setIsAutoSaving(false);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }, 2000); // 2 second delay
    },
    [saveToLocalStorage],
  );

  // Clear localStorage when form is successfully saved
  const clearAutoSave = useCallback(() => {
    try {
      localStorage.removeItem(AUTO_SAVE_KEY);
      setHasUnsavedChanges(false);
      setHasLocalDraft(false);
      console.log("🗑️ Auto-save cleared after successful save"); // DEBUG
    } catch (error) {
      console.error("❌ Failed to clear auto-save:", error);
    }
  }, [AUTO_SAVE_KEY]);

  // Restore draft on component mount
  useEffect(() => {
    // SECURITY: Clear any drafts that belong to OTHER churches (same browser, different tenant)
    if (churchId) {
      Object.keys(localStorage)
        .filter(
          (k) => k.startsWith("form-builder-draft-") && k !== AUTO_SAVE_KEY,
        )
        .forEach((k) => localStorage.removeItem(k));
    }

    // Check if draft exists for THIS church
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const saveDate = new Date(parsed.timestamp);
      const hoursSinceLastSave =
        (Date.now() - saveDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastSave < 24) {
        setHasLocalDraft(true);
      } else {
        localStorage.removeItem(AUTO_SAVE_KEY);
        setHasLocalDraft(false);
      }
    } else {
      setHasLocalDraft(false);
    }

    const restored = restoreFromLocalStorage();
    if (!restored) {
      // No draft found, start fresh
      console.log("🆕 Starting with fresh form"); // DEBUG
    }
  }, [restoreFromLocalStorage, AUTO_SAVE_KEY, churchId]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Generate QR Code
  // 🎨 ADVANCED QR GENERATION (using modular function)
  const generateQRCode = async () => {
    // FIXED: Block QR generation if form hasn't been saved yet (prevents unscannable QR codes)
    if (!currentFormSlug) {
      toast.error(
        "Guarda el formulario primero para generar el QR con URL corta",
      );
      return;
    }
    setIsGenerating(true);
    try {
      const url = buildFormUrl();
      const qrDataURL = await generateAdvancedQR(url, qrConfig);
      setQRCodeUrl(qrDataURL);
      toast.success("QR generado exitosamente con personalización avanzada");
    } catch (error) {
      console.error("QR generation failed:", error);
      toast.error("Error generando QR");
    } finally {
      setIsGenerating(false);
    }
  };

  // 📤 HANDLE IMAGE UPLOADS (using modular function)
  const handleImageUpload = async (
    file: File,
    type: "form-background" | "qr-logo" | "qr-background",
  ) => {
    try {
      console.log(`📤 Starting ${type} upload:`, file.name, file.size);
      const url = await uploadImage(file, type);
      console.log(
        `✅ ${type} upload successful:`,
        url.substring(0, 50) + "...",
      );

      // Update appropriate config
      if (type === "qr-logo") {
        setQRConfig((prev) => ({ ...prev, logoImage: url }));
        toast.success("Logo del QR subido exitosamente");
      } else if (type === "qr-background") {
        setQRConfig((prev) => ({
          ...prev,
          backgroundImage: url,
          useBackgroundImage: true,
        }));
        toast.success("Fondo del QR subido exitosamente");
      } else {
        setFormConfig((prev) => ({ ...prev, backgroundImage: url }));
        toast.success("Fondo del formulario subido exitosamente");
      }
    } catch (error: any) {
      console.error(`❌ ${type} upload failed:`, error);
      toast.error(error.message || "Error al subir la imagen");
    }
  };

  // Save form function
  const saveForm = async () => {
    try {
      const response = await fetch("/api/form-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formConfig.title,
          description: formConfig.description,
          fields: formConfig.fields,
          config: {
            bgColor: formConfig.formBackgroundColor || "#ffffff",
            textColor: formConfig.bodyTextColor || "#000000",
            fontFamily: formConfig.fontFamily || "Inter, sans-serif",
            bgImage: formConfig.backgroundImage || null,
            submitButtonText: formConfig.submitButtonText,
            submitButtonColor: formConfig.submitButtonColor,
            submitButtonTextColor: formConfig.submitButtonTextColor,
            // Church Branding
            churchLogo: formConfig.churchLogo,
            primaryColor: formConfig.primaryColor,
            secondaryColor: formConfig.secondaryColor,
            headerTextColor: formConfig.headerTextColor,
            bodyTextColor: formConfig.bodyTextColor,
            borderColor: formConfig.borderColor,
            inputBorderColor: formConfig.inputBorderColor,
            inputFocusColor: formConfig.inputFocusColor,
            // Typography sizing
            titleFontSize: formConfig.titleFontSize,
            bodyFontSize: formConfig.bodyFontSize,
            fieldLabelFontSize: formConfig.fieldLabelFontSize,
            inputFontSize: formConfig.inputFontSize,
            // Layout
            borderRadius: formConfig.borderRadius,
            formMaxWidth: formConfig.formMaxWidth,
          },
          qrConfig: {
            // 🎨 ALL ADVANCED QR CUSTOMIZATION FIELDS
            size: qrConfig.size,
            margin: qrConfig.margin,
            backgroundColor: qrConfig.backgroundColor,
            foregroundColor: qrConfig.foregroundColor,
            dotType: qrConfig.dotType,
            cornerType: qrConfig.cornerType,
            useGradient: qrConfig.useGradient,
            gradientType: qrConfig.gradientType,
            gradientColors: qrConfig.gradientColors,
            gradientAngle: qrConfig.gradientAngle,
            useBackgroundImage: qrConfig.useBackgroundImage,
            backgroundImage: qrConfig.backgroundImage,
            backgroundOpacity: qrConfig.backgroundOpacity,
            logo: qrConfig.logoImage || null,
            logoImage: qrConfig.logoImage,
            logoSize: qrConfig.logoSize,
            logoOpacity: qrConfig.logoOpacity,
            logoMargin: qrConfig.logoMargin,
            logoShape: qrConfig.logoShape,
            logoBackgroundColor: qrConfig.logoBackgroundColor,
            logoBackgroundOpacity: qrConfig.logoBackgroundOpacity,
            eyeColor: qrConfig.eyeColor,
            eyeBorderColor: qrConfig.eyeBorderColor,
            eyeShape: qrConfig.eyeShape,
          },
        }),
      });

      if (response.ok) {
        const savedForm = await response.json();
        setCurrentFormSlug(savedForm.form.slug);
        setSavedForms((prev) => [savedForm.form, ...prev]);
        clearAutoSave();
        toast.success(
          "✅ Formulario guardado con personalización completa de iglesia",
        );
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to save form");
      }
    } catch (error: any) {
      console.error("❌ Save error:", error);
      toast.error(error.message || "Error guardando formulario");
    }
  };

  // Helper functions
  const addField = () => {
    // FIXED: Use prev.fields.length for accurate count; always include options: [] so
    // select/radio fields work immediately without initializing undefined array
    updateFormConfig((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          id: Date.now(),
          label: `Campo ${prev.fields.length + 1}`,
          type: "text" as const,
          required: false,
          options: [],
        },
      ],
    }));
  };

  const removeField = (fieldId: number | string) => {
    updateFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));
  };

  const updateField = (fieldId: number | string, key: string, value: any) => {
    updateFormConfig((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === fieldId ? { ...field, [key]: value } : field,
      ),
    }));
  };

  // Insert a new block of a given type at the end (or after selectedFieldId)
  const insertBlock = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now(),
      label:
        type === "heading"
          ? "Nuevo Encabezado"
          : type === "divider"
            ? ""
            : type === "email"
              ? "Correo Electrónico"
              : type === "tel"
                ? "Teléfono"
                : type === "textarea"
                  ? "Comentarios"
                  : type === "select"
                    ? "Selecciona una opción"
                    : type === "checkbox"
                      ? "Aceptar términos"
                      : type === "radio"
                        ? "Escoge una opción"
                        : type === "date"
                          ? "Fecha"
                          : type === "number"
                            ? "Número"
                            : "Nuevo Campo",
      type,
      required: false,
      options:
        type === "select" || type === "radio" ? ["Opción 1", "Opción 2"] : [],
      headingLevel: type === "heading" ? 2 : undefined,
    };

    updateFormConfig((prev) => {
      if (selectedFieldId === null) {
        return { ...prev, fields: [...prev.fields, newField] };
      }
      const idx = prev.fields.findIndex((f) => f.id === selectedFieldId);
      const insertAt = idx === -1 ? prev.fields.length : idx + 1;
      const updated = [...prev.fields];
      updated.splice(insertAt, 0, newField);
      return { ...prev, fields: updated };
    });
    setSelectedFieldId(newField.id);
  };

  // Move field up or down
  const moveField = (fieldId: number | string, direction: "up" | "down") => {
    updateFormConfig((prev) => {
      const fields = [...prev.fields];
      const idx = fields.findIndex((f) => f.id === fieldId);
      if (idx === -1) return prev;
      if (direction === "up" && idx === 0) return prev;
      if (direction === "down" && idx === fields.length - 1) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      [fields[idx], fields[swapIdx]] = [fields[swapIdx], fields[idx]];
      return { ...prev, fields };
    });
  };

  const buildFormUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return currentFormSlug
      ? `${baseUrl}/form-viewer?slug=${currentFormSlug}`
      : `${baseUrl}/form-viewer?preview=true&title=${encodeURIComponent(formConfig.title)}`;
  };

  const copyFormUrl = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(buildFormUrl());
      toast.success("URL copiada al portapapeles");
    }
  };

  // Apply template
  const applyTemplate = (template: any) => {
    const templateFields = template.fields.map((field: any, index: number) => ({
      ...field,
      id: Date.now() + index, // MUST come after spread so numeric id wins over template string id
    }));

    updateFormConfig((prev) => ({
      ...prev,
      title: template.name.trim(),
      description: template.description,
      fields: templateFields,
    }));

    setSelectedTemplate(template.id);
    setShowTemplates(false);
    toast.success(`Plantilla "${template.name}" aplicada`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* ═══════════════════════════════════════════════
          TOP HEADER BAR
      ═══════════════════════════════════════════════ */}
      <div className="flex-none bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {!showTemplates ? (
            <Button
              onClick={() => {
                setShowTemplates(true);
                setSelectedFieldId(null);
              }}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Plantillas
            </Button>
          ) : null}

          <div>
            {!showTemplates ? (
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800 text-sm">
                  {formConfig.title}
                </span>
                <div className="flex items-center gap-1 text-xs">
                  {hasUnsavedChanges ? (
                    <span className="flex items-center gap-1 text-orange-500">
                      <RefreshCcw className="h-3 w-3 animate-spin" />
                      Guardando…
                    </span>
                  ) : lastSaved ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Save className="h-3 w-3" />
                      Guardado {lastSaved.toLocaleTimeString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">Sin guardar</span>
                  )}
                </div>
              </div>
            ) : (
              <h1 className="text-lg font-bold text-gray-800">
                Plantillas de Formularios
              </h1>
            )}
          </div>
        </div>

        {!showTemplates && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyFormUrl}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar URL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-2 text-purple-600 border-purple-300"
            >
              <QrCode className="h-4 w-4" />
              Código QR
            </Button>
            <Button
              onClick={saveForm}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Guardar
            </Button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          TEMPLATES GRID (when showTemplates = true)
      ═══════════════════════════════════════════════ */}
      {showTemplates ? (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-gray-500 mb-6 text-sm">
              Elige una plantilla para empezar o crea desde cero.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Blank form option */}
              <Card
                className="hover:shadow-lg transition-all cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400"
                onClick={() => {
                  updateFormConfig((prev) => ({
                    ...prev,
                    title: "Nuevo Formulario",
                    description: "",
                    fields: [
                      {
                        id: Date.now(),
                        label: "Nombre Completo",
                        type: "text",
                        required: true,
                        options: [],
                      },
                    ],
                  }));
                  setSelectedTemplate(null);
                  setShowTemplates(false);
                }}
              >
                <CardContent className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Plus className="h-10 w-10 mb-2 text-gray-400" />
                  <span className="font-medium">Formulario en blanco</span>
                  <span className="text-xs text-gray-400 mt-1">
                    Empieza desde cero
                  </span>
                </CardContent>
              </Card>

              {SMART_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className="hover:shadow-lg transition-all cursor-pointer border border-gray-200"
                  onClick={() => applyTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      {getTemplateIcon(template.icon)}
                      <div>
                        <CardTitle className="text-base">
                          {template.name}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <span className="text-xs text-gray-400">
                      {template.fields.length} campos
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════
            3-PANEL WYSIWYG EDITOR
        ═══════════════════════════════════════════════ */
        <div className="flex-1 flex overflow-hidden">
          {/* ──────────────────────────────
              LEFT PANEL — Block Picker
          ────────────────────────────── */}
          <div className="w-52 flex-none bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Bloques
              </p>
            </div>

            {/* QUESTIONS */}
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 py-1">
                Preguntas
              </p>
              {[
                { type: "text" as const, label: "Respuesta Corta", Icon: Type },
                {
                  type: "textarea" as const,
                  label: "Respuesta Larga",
                  Icon: AlignLeft,
                },
                {
                  type: "select" as const,
                  label: "Desplegable",
                  Icon: DropdownIcon,
                },
                {
                  type: "radio" as const,
                  label: "Opción Múltiple",
                  Icon: Circle,
                },
                {
                  type: "checkbox" as const,
                  label: "Casilla",
                  Icon: CheckSquare,
                },
                { type: "number" as const, label: "Número", Icon: Hash },
                { type: "email" as const, label: "Email", Icon: Mail },
                { type: "tel" as const, label: "Teléfono", Icon: Phone },
                { type: "date" as const, label: "Fecha", Icon: CalendarDays },
              ].map(({ type, label, Icon }) => (
                <button
                  key={type}
                  onClick={() => insertBlock(type)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                >
                  <Icon className="h-4 w-4 flex-none text-gray-500" />
                  {label}
                </button>
              ))}
            </div>

            <Separator className="my-1" />

            {/* LAYOUT BLOCKS */}
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 py-1">
                Diseño
              </p>
              {[
                {
                  type: "heading" as const,
                  label: "Encabezado",
                  Icon: Heading1,
                },
                { type: "divider" as const, label: "Divisor", Icon: Minus },
              ].map(({ type, label, Icon }) => (
                <button
                  key={type}
                  onClick={() => insertBlock(type)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors text-left"
                >
                  <Icon className="h-4 w-4 flex-none text-gray-500" />
                  {label}
                </button>
              ))}
            </div>

            <Separator className="my-1" />

            {/* PRESET QUICK-ADD */}
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 py-1">
                Campos Rápidos
              </p>
              {PRESET_FIELDS.slice(0, 12).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    const newField: FormField = {
                      id: Date.now(),
                      label: preset.label,
                      type: preset.type as FormField["type"],
                      required: false,
                      options: preset.options ? [...preset.options] : [],
                    };
                    updateFormConfig((prev) => {
                      if (selectedFieldId === null)
                        return { ...prev, fields: [...prev.fields, newField] };
                      const idx = prev.fields.findIndex(
                        (f) => f.id === selectedFieldId,
                      );
                      const insertAt =
                        idx === -1 ? prev.fields.length : idx + 1;
                      const updated = [...prev.fields];
                      updated.splice(insertAt, 0, newField);
                      return { ...prev, fields: updated };
                    });
                    setSelectedFieldId(newField.id);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors text-left"
                >
                  {getPresetFieldIcon(preset.icon)}
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ──────────────────────────────
              CENTER PANEL — Form Canvas (WYSIWYG)
          ────────────────────────────── */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-6 flex justify-center">
            <div
              className="w-full shadow-lg rounded-xl overflow-hidden"
              style={{
                maxWidth: formConfig.formMaxWidth || "640px",
                backgroundColor: formConfig.formBackgroundColor || "#ffffff",
                fontFamily: formConfig.fontFamily || "Inter, sans-serif",
              }}
            >
              {/* Church Logo */}
              {formConfig.churchLogo && (
                <div className="flex justify-center pt-6 px-8">
                  <img
                    src={formConfig.churchLogo}
                    alt="Logo"
                    className="h-16 object-contain"
                  />
                </div>
              )}

              {/* Title & Description — inline editable */}
              <div className="px-8 pt-8 pb-2">
                <input
                  className="w-full font-bold bg-transparent border-none outline-none focus:bg-blue-50 focus:rounded px-1 -mx-1 transition-colors"
                  style={{
                    color: formConfig.headerTextColor || "#111827",
                    fontSize: formConfig.titleFontSize || "28px",
                  }}
                  value={formConfig.title}
                  onChange={(e) =>
                    updateFormConfig((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Título del formulario"
                  onClick={() => setSelectedFieldId(null)}
                />
                <textarea
                  className="w-full mt-1 bg-transparent border-none outline-none focus:bg-blue-50 focus:rounded px-1 -mx-1 resize-none transition-colors"
                  style={{
                    color: formConfig.bodyTextColor || "#6b7280",
                    fontSize: formConfig.bodyFontSize || "14px",
                    lineHeight: "1.5",
                  }}
                  rows={2}
                  value={formConfig.description || ""}
                  onChange={(e) =>
                    updateFormConfig((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descripción del formulario (opcional)"
                  onClick={() => setSelectedFieldId(null)}
                />
              </div>

              {/* Fields */}
              <div className="px-8 pb-4 space-y-1">
                {formConfig.fields.map((field, index) => {
                  const isSelected = selectedFieldId === field.id;

                  // ── DIVIDER BLOCK ──
                  if (field.type === "divider") {
                    return (
                      <div
                        key={field.id}
                        className={`group relative py-3 cursor-pointer rounded-lg transition-all ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                        onClick={() => setSelectedFieldId(field.id)}
                      >
                        <hr className="border-gray-300" />
                        {isSelected && (
                          <div className="absolute -top-2 right-1 flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, "up");
                              }}
                              className="bg-white border rounded p-0.5 hover:bg-gray-100"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, "down");
                              }}
                              className="bg-white border rounded p-0.5 hover:bg-gray-100"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeField(field.id);
                              }}
                              className="bg-white border border-red-300 rounded p-0.5 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ── HEADING BLOCK ──
                  if (field.type === "heading") {
                    const Tag =
                      `h${field.headingLevel || 2}` as keyof JSX.IntrinsicElements;
                    const sizes: Record<number, string> = {
                      1: "22px",
                      2: "18px",
                      3: "15px",
                    };
                    return (
                      <div
                        key={field.id}
                        className={`group relative py-2 cursor-pointer rounded-lg transition-all ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                        onClick={() => setSelectedFieldId(field.id)}
                      >
                        <input
                          className="w-full font-bold bg-transparent border-none outline-none px-1"
                          style={{
                            fontSize: sizes[field.headingLevel || 2],
                            color: formConfig.headerTextColor || "#111827",
                          }}
                          value={field.label}
                          onChange={(e) =>
                            updateField(field.id, "label", e.target.value)
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFieldId(field.id);
                          }}
                        />
                        {isSelected && (
                          <div className="absolute -top-2 right-1 flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, "up");
                              }}
                              className="bg-white border rounded p-0.5 hover:bg-gray-100"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(field.id, "down");
                              }}
                              className="bg-white border rounded p-0.5 hover:bg-gray-100"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeField(field.id);
                              }}
                              className="bg-white border border-red-300 rounded p-0.5 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // ── FIELD BLOCKS ──
                  return (
                    <div
                      key={field.id}
                      className={`group relative py-3 px-1 cursor-pointer rounded-lg transition-all ${isSelected ? "ring-2 ring-blue-500 bg-blue-50/60" : "hover:bg-gray-50"}`}
                      onClick={() => setSelectedFieldId(field.id)}
                    >
                      {/* Field controls */}
                      {isSelected && (
                        <div className="absolute -top-2 right-1 flex gap-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(field.id, "up");
                            }}
                            className="bg-white border rounded p-0.5 hover:bg-gray-100 shadow-sm"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(field.id, "down");
                            }}
                            className="bg-white border rounded p-0.5 hover:bg-gray-100 shadow-sm"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                            className="bg-white border border-red-300 rounded p-0.5 hover:bg-red-50 shadow-sm"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </button>
                        </div>
                      )}

                      {/* Label */}
                      {field.type !== "checkbox" && (
                        <label
                          className="block font-medium mb-1"
                          style={{
                            color: formConfig.bodyTextColor || "#374151",
                            fontSize: formConfig.fieldLabelFontSize || "14px",
                          }}
                        >
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                      )}

                      {/* Input preview (non-interactive) */}
                      {field.type === "textarea" ? (
                        <textarea
                          className="w-full p-2.5 resize-none pointer-events-none"
                          style={{
                            borderColor:
                              formConfig.inputBorderColor || "#d1d5db",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderRadius: formConfig.borderRadius || "8px",
                            fontSize: formConfig.inputFontSize || "14px",
                            color: "#9ca3af",
                            backgroundColor: "#fff",
                          }}
                          rows={3}
                          placeholder={
                            field.placeholder ||
                            `Ingrese ${field.label.toLowerCase()}`
                          }
                          readOnly
                        />
                      ) : field.type === "select" ? (
                        <select
                          className="w-full p-2.5 pointer-events-none"
                          style={{
                            borderColor:
                              formConfig.inputBorderColor || "#d1d5db",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderRadius: formConfig.borderRadius || "8px",
                            fontSize: formConfig.inputFontSize || "14px",
                            color: "#6b7280",
                            backgroundColor: "#fff",
                          }}
                        >
                          <option>Seleccionar…</option>
                          {field.options?.map((opt, i) => (
                            <option key={i}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === "checkbox" ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 pointer-events-none"
                          />
                          <span
                            style={{
                              color: formConfig.bodyTextColor || "#374151",
                              fontSize: formConfig.inputFontSize || "14px",
                            }}
                          >
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </span>
                        </div>
                      ) : field.type === "radio" && field.options ? (
                        <div className="space-y-1.5">
                          {field.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`prev-${field.id}`}
                                className="pointer-events-none"
                              />
                              <span
                                style={{
                                  color: formConfig.bodyTextColor || "#374151",
                                  fontSize: formConfig.inputFontSize || "14px",
                                }}
                              >
                                {opt}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <input
                          type={field.type}
                          className="w-full p-2.5 pointer-events-none"
                          style={{
                            borderColor:
                              formConfig.inputBorderColor || "#d1d5db",
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderRadius: formConfig.borderRadius || "8px",
                            fontSize: formConfig.inputFontSize || "14px",
                            color: "#9ca3af",
                            backgroundColor: "#fff",
                          }}
                          placeholder={
                            field.placeholder ||
                            `Ingrese ${field.label.toLowerCase()}`
                          }
                          readOnly
                        />
                      )}
                    </div>
                  );
                })}

                {/* + Insert after last field */}
                <button
                  onClick={() => {
                    setSelectedFieldId(null);
                    insertBlock("text");
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar campo
                </button>

                {/* Submit button preview */}
                <div className="pt-4">
                  <button
                    className="px-8 py-2.5 rounded-lg font-medium flex items-center gap-2 pointer-events-none"
                    style={{
                      backgroundColor:
                        formConfig.submitButtonColor || "#2563eb",
                      color: formConfig.submitButtonTextColor || "#ffffff",
                      borderRadius: formConfig.borderRadius || "8px",
                      fontSize: formConfig.inputFontSize || "14px",
                    }}
                  >
                    {formConfig.submitButtonText || "Enviar"}
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────
              RIGHT PANEL — Properties / Style
          ────────────────────────────── */}
          <div className="w-72 flex-none bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
            {/* Panel toggle */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setRightPanel("properties")}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${rightPanel === "properties" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700"}`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Propiedades
              </button>
              <button
                onClick={() => setRightPanel("style")}
                className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${rightPanel === "style" ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Palette className="h-3.5 w-3.5" />
                Estilo
              </button>
            </div>

            {rightPanel === "properties" ? (
              /* ── PROPERTIES TAB ── */
              <div className="flex-1 p-4 space-y-4">
                {selectedFieldId === null ? (
                  /* No field selected — show form-level settings */
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 font-medium">
                      FORMULARIO
                    </p>
                    <div>
                      <Label className="text-xs">Texto del Botón Enviar</Label>
                      <Input
                        value={
                          formConfig.submitButtonText || "Enviar Formulario"
                        }
                        onChange={(e) =>
                          updateFormConfig((prev) => ({
                            ...prev,
                            submitButtonText: e.target.value,
                          }))
                        }
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Color Botón</Label>
                        <Input
                          type="color"
                          value={formConfig.submitButtonColor || "#2563eb"}
                          onChange={(e) =>
                            updateFormConfig((prev) => ({
                              ...prev,
                              submitButtonColor: e.target.value,
                            }))
                          }
                          className="mt-1 h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Color Texto</Label>
                        <Input
                          type="color"
                          value={formConfig.submitButtonTextColor || "#ffffff"}
                          onChange={(e) =>
                            updateFormConfig((prev) => ({
                              ...prev,
                              submitButtonTextColor: e.target.value,
                            }))
                          }
                          className="mt-1 h-8"
                        />
                      </div>
                    </div>

                    <Separator />
                    <p className="text-xs text-gray-500 font-medium">
                      LOGO DE IGLESIA
                    </p>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                      {formConfig.churchLogo ? (
                        <div>
                          <img
                            src={formConfig.churchLogo}
                            alt="Logo"
                            className="h-12 object-contain mx-auto mb-2"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateFormConfig((prev) => ({
                                ...prev,
                                churchLogo: undefined,
                              }))
                            }
                            className="text-red-500 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Quitar
                          </Button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => churchLogoInputRef.current?.click()}
                            className="text-xs"
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Subir Logo
                          </Button>
                          <input
                            ref={churchLogoInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleImageUpload(f, "form-background");
                            }}
                          />
                        </>
                      )}
                    </div>

                    <Separator />
                    <p className="text-xs text-gray-400 italic">
                      Haz clic en un campo del formulario para editarlo.
                    </p>
                  </div>
                ) : (
                  (() => {
                    const field = formConfig.fields.find(
                      (f) => f.id === selectedFieldId,
                    );
                    if (!field)
                      return (
                        <p className="text-xs text-gray-400">
                          Campo no encontrado.
                        </p>
                      );

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 font-medium">
                            CAMPO SELECCIONADO
                          </p>
                          <button
                            onClick={() => removeField(field.id)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Label */}
                        {field.type !== "divider" && (
                          <div>
                            <Label className="text-xs">
                              {field.type === "heading"
                                ? "Texto del Encabezado"
                                : "Etiqueta del Campo"}
                            </Label>
                            <Input
                              value={field.label}
                              onChange={(e) =>
                                updateField(field.id, "label", e.target.value)
                              }
                              className="mt-1 h-8 text-sm"
                            />
                          </div>
                        )}

                        {/* Placeholder */}
                        {![
                          "checkbox",
                          "radio",
                          "select",
                          "heading",
                          "divider",
                          "date",
                        ].includes(field.type) && (
                          <div>
                            <Label className="text-xs">
                              Texto de Ayuda (placeholder)
                            </Label>
                            <Input
                              value={field.placeholder || ""}
                              onChange={(e) =>
                                updateField(
                                  field.id,
                                  "placeholder",
                                  e.target.value,
                                )
                              }
                              className="mt-1 h-8 text-sm"
                              placeholder="ej. Ingrese su nombre"
                            />
                          </div>
                        )}

                        {/* Type changer */}
                        {!["heading", "divider"].includes(field.type) && (
                          <div>
                            <Label className="text-xs">Tipo de Campo</Label>
                            <Select
                              value={field.type}
                              onValueChange={(val) => {
                                updateField(field.id, "type", val);
                                if (val === "select" || val === "radio") {
                                  if (
                                    !field.options ||
                                    field.options.length === 0
                                  ) {
                                    updateField(field.id, "options", [
                                      "Opción 1",
                                      "Opción 2",
                                    ]);
                                  }
                                }
                              }}
                            >
                              <SelectTrigger className="mt-1 h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">
                                  Texto Corto
                                </SelectItem>
                                <SelectItem value="textarea">
                                  Texto Largo
                                </SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="tel">Teléfono</SelectItem>
                                <SelectItem value="number">Número</SelectItem>
                                <SelectItem value="date">Fecha</SelectItem>
                                <SelectItem value="select">
                                  Desplegable
                                </SelectItem>
                                <SelectItem value="radio">
                                  Opción Múltiple
                                </SelectItem>
                                <SelectItem value="checkbox">
                                  Casilla
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Heading level */}
                        {field.type === "heading" && (
                          <div>
                            <Label className="text-xs">
                              Nivel de Encabezado
                            </Label>
                            <Select
                              value={String(field.headingLevel || 2)}
                              onValueChange={(v) =>
                                updateField(
                                  field.id,
                                  "headingLevel",
                                  parseInt(v),
                                )
                              }
                            >
                              <SelectTrigger className="mt-1 h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">H1 — Grande</SelectItem>
                                <SelectItem value="2">H2 — Mediano</SelectItem>
                                <SelectItem value="3">H3 — Pequeño</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Required toggle */}
                        {!["heading", "divider"].includes(field.type) && (
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`req-${field.id}`}
                              checked={field.required}
                              onChange={(e) =>
                                updateField(
                                  field.id,
                                  "required",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 accent-blue-600"
                            />
                            <label
                              htmlFor={`req-${field.id}`}
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              Campo obligatorio
                            </label>
                          </div>
                        )}

                        {/* Options editor (select / radio) */}
                        {(field.type === "select" ||
                          field.type === "radio") && (
                          <div>
                            <Label className="text-xs mb-2 block">
                              Opciones
                            </Label>
                            <div className="space-y-2">
                              {(field.options || []).map((opt, i) => (
                                <div key={i} className="flex gap-2">
                                  <Input
                                    value={opt}
                                    onChange={(e) => {
                                      const newOpts = [
                                        ...(field.options || []),
                                      ];
                                      newOpts[i] = e.target.value;
                                      updateField(field.id, "options", newOpts);
                                    }}
                                    className="h-7 text-sm flex-1"
                                    placeholder={`Opción ${i + 1}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newOpts = (
                                        field.options || []
                                      ).filter((_, idx) => idx !== i);
                                      updateField(field.id, "options", newOpts);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newOpts = [
                                    ...(field.options || []),
                                    `Opción ${(field.options?.length || 0) + 1}`,
                                  ];
                                  updateField(field.id, "options", newOpts);
                                }}
                                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Agregar opción
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Reorder buttons */}
                        <Separator />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveField(field.id, "up")}
                            className="flex-1 h-7 text-xs"
                          >
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Subir
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveField(field.id, "down")}
                            className="flex-1 h-7 text-xs"
                          >
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Bajar
                          </Button>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            ) : (
              /* ── STYLE TAB ── */
              <div className="flex-1 p-4 space-y-5">
                <p className="text-xs text-gray-500 font-medium">
                  COLORES Y TIPOGRAFÍA
                </p>

                <div className="space-y-3">
                  {[
                    {
                      label: "Color Título",
                      key: "headerTextColor",
                      default: "#111827",
                    },
                    {
                      label: "Color Texto",
                      key: "bodyTextColor",
                      default: "#374151",
                    },
                    {
                      label: "Color Principal",
                      key: "primaryColor",
                      default: "#2563eb",
                    },
                    {
                      label: "Fondo Formulario",
                      key: "formBackgroundColor",
                      default: "#ffffff",
                    },
                    {
                      label: "Borde Inputs",
                      key: "inputBorderColor",
                      default: "#d1d5db",
                    },
                    {
                      label: "Foco Inputs",
                      key: "inputFocusColor",
                      default: "#2563eb",
                    },
                  ].map(({ label, key, default: def }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <Label className="text-xs">{label}</Label>
                      <input
                        type="color"
                        value={(formConfig as any)[key] || def}
                        onChange={(e) =>
                          updateFormConfig((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="w-9 h-7 rounded border border-gray-200 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                <Separator />
                <p className="text-xs text-gray-500 font-medium">
                  FUENTE Y TAMAÑOS
                </p>

                <div>
                  <Label className="text-xs">Familia de Fuente</Label>
                  <Select
                    value={formConfig.fontFamily || "Inter, sans-serif"}
                    onValueChange={(v) =>
                      updateFormConfig((prev) => ({ ...prev, fontFamily: v }))
                    }
                  >
                    <SelectTrigger className="mt-1 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                      <SelectItem value="Georgia, serif">Georgia</SelectItem>
                      <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                      <SelectItem value="'Times New Roman', serif">
                        Times New Roman
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Título",
                      key: "titleFontSize",
                      opts: ["18px", "22px", "28px", "32px", "36px"],
                    },
                    {
                      label: "Descripción",
                      key: "bodyFontSize",
                      opts: ["12px", "14px", "16px", "18px"],
                    },
                    {
                      label: "Etiquetas",
                      key: "fieldLabelFontSize",
                      opts: ["11px", "12px", "14px", "16px"],
                    },
                    {
                      label: "Inputs",
                      key: "inputFontSize",
                      opts: ["12px", "14px", "16px"],
                    },
                  ].map(({ label, key, opts }) => (
                    <div key={key}>
                      <Label className="text-xs">{label}</Label>
                      <Select
                        value={(formConfig as any)[key] || opts[1]}
                        onValueChange={(v) =>
                          updateFormConfig((prev) => ({ ...prev, [key]: v }))
                        }
                      >
                        <SelectTrigger className="mt-1 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {opts.map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <Separator />
                <p className="text-xs text-gray-500 font-medium">DISEÑO</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Bordes</Label>
                    <Select
                      value={formConfig.borderRadius || "8px"}
                      onValueChange={(v) =>
                        updateFormConfig((prev) => ({
                          ...prev,
                          borderRadius: v,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0px">Sin redondeo</SelectItem>
                        <SelectItem value="4px">Sutil</SelectItem>
                        <SelectItem value="8px">Normal</SelectItem>
                        <SelectItem value="12px">Moderado</SelectItem>
                        <SelectItem value="16px">Redondeado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Ancho Máx.</Label>
                    <Select
                      value={formConfig.formMaxWidth || "640px"}
                      onValueChange={(v) =>
                        updateFormConfig((prev) => ({
                          ...prev,
                          formMaxWidth: v,
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1 h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480px">Compacto</SelectItem>
                        <SelectItem value="640px">Normal</SelectItem>
                        <SelectItem value="768px">Amplio</SelectItem>
                        <SelectItem value="900px">Ancho</SelectItem>
                        <SelectItem value="100%">Completo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />
                <p className="text-xs text-gray-500 font-medium">
                  IMAGEN DE FONDO
                </p>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                  {formConfig.backgroundImage ? (
                    <div>
                      <img
                        src={formConfig.backgroundImage}
                        alt="Fondo"
                        className="max-h-24 object-cover mx-auto rounded mb-2"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateFormConfig((prev) => ({
                            ...prev,
                            backgroundImage: undefined,
                          }))
                        }
                        className="text-red-500 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Quitar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-1" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => formBgInputRef.current?.click()}
                        className="text-xs"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Subir Fondo
                      </Button>
                      <input
                        ref={formBgInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(f, "form-background");
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          QR MODAL
      ═══════════════════════════════════════════════ */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold">Código QR del Formulario</h2>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {!currentFormSlug && (
                <Alert className="mb-4 border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 text-sm">
                    Guarda el formulario primero para generar un QR con URL
                    corta y escaneable.
                    <Button
                      onClick={async () => {
                        await saveForm();
                      }}
                      size="sm"
                      className="ml-2 bg-orange-600 hover:bg-orange-700 text-white text-xs h-7"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Guardar Ahora
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              <QRCustomizationPanel
                qrConfig={qrConfig}
                setQRConfig={setQRConfig}
                qrCodeUrl={qrCodeUrl}
                isGenerating={isGenerating}
                onGenerate={generateQRCode}
                onCopyUrl={copyFormUrl}
                onImageUpload={(file, type) => handleImageUpload(file, type)}
                formUrl={buildFormUrl()}
                formTitle={formConfig.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
