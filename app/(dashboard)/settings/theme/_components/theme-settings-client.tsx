"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  Palette,
  Type,
  Layout,
  Settings,
  Undo2,
  Save,
  Eye,
  Building2,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "./color-picker";
import { ThemePreview } from "./theme-preview";

interface ThemePreference {
  id: string;
  themeName: string;
  themeMode: "light" | "dark" | "auto";
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  destructiveColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  cardColor?: string;
  cardForegroundColor?: string;
  borderColor?: string;
  mutedColor?: string;
  mutedForegroundColor?: string;
  fontFamily?: string;
  fontSize?: "small" | "medium" | "large" | "xl";
  borderRadius?: string;
  compactMode: boolean;
  logoUrl?: string;
  faviconUrl?: string;
  brandName?: string;
  isPublic: boolean;
}

const DEFAULT_COLORS = {
  light: {
    primary: "220.9 39.3% 11%",
    secondary: "220 14.3% 95.9%",
    accent: "220 14.3% 95.9%",
    destructive: "0 84.2% 60.2%",
    background: "0 0% 100%",
    foreground: "224 71.4% 4.1%",
    card: "0 0% 100%",
    cardForeground: "224 71.4% 4.1%",
    border: "220 13% 91%",
    muted: "220 14.3% 95.9%",
    mutedForeground: "220 8.9% 46.1%",
  },
  dark: {
    primary: "210 20% 98%",
    secondary: "215 27.9% 16.9%",
    accent: "215 27.9% 16.9%",
    destructive: "0 62.8% 30.6%",
    background: "224 71.4% 4.1%",
    foreground: "210 20% 98%",
    card: "224 71.4% 4.1%",
    cardForeground: "210 20% 98%",
    border: "215 27.9% 16.9%",
    muted: "215 27.9% 16.9%",
    mutedForeground: "217.9 10.6% 64.9%",
  },
};

const COLOR_PRESETS = [
  { name: "Azul Confianza", colors: ["#2563EB", "#6B7280", "#059669"] },
  { name: "Verde Esperanza", colors: ["#059669", "#6B7280", "#DC2626"] },
  { name: "Púrpura Realeza", colors: ["#7C3AED", "#6B7280", "#F59E0B"] },
  { name: "Rojo Pasión", colors: ["#DC2626", "#6B7280", "#059669"] },
  { name: "Naranja Cálido", colors: ["#EA580C", "#6B7280", "#2563EB"] },
  { name: "Gris Elegante", colors: ["#374151", "#6B7280", "#3B82F6"] },
  { name: "Índigo Profundo", colors: ["#4F46E5", "#6B7280", "#0EA5E9"] },
  { name: "Teal Fresco", colors: ["#0D9488", "#6B7280", "#8B5CF6"] },
];

interface ChurchInfo {
  name: string;
  address: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  logo: string;
}

export function ThemeSettingsClient() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [themePreference, setThemePreference] =
    useState<ThemePreference | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [churchInfo, setChurchInfo] = useState<ChurchInfo>({
    name: "",
    address: "",
    country: "Colombia",
    phone: "",
    email: "",
    website: "",
    description: "",
    logo: "",
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const fetchThemePreferences = async () => {
    try {
      const response = await fetch("/api/theme-preferences");
      if (response.ok) {
        const data = await response.json();
        setThemePreference(data);
      }
    } catch (error) {
      console.error("Error fetching theme preferences:", error);
      toast.error("Error al cargar configuración de tema");
    } finally {
      setLoading(false);
    }
  };

  const THEME_ALLOWED_ROLES = ["SUPER_ADMIN", "PASTOR", "ADMIN_IGLESIA"];

  const fetchChurchInfo = async () => {
    try {
      const res = await fetch("/api/church/profile");
      if (res.ok) {
        const data = await res.json();
        setChurchInfo({
          name: data.church?.name || "",
          address: data.church?.address || "",
          country: data.church?.country || "Colombia",
          phone: data.church?.phone || "",
          email: data.church?.email || "",
          website: data.church?.website || "",
          description: data.church?.description || "",
          logo: data.church?.logo || "",
        });
      }
    } catch (error) {
      console.error("Error fetching church info:", error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("El archivo debe ser menor a 2MB");
      return;
    }
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "church-logo");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setChurchInfo((prev) => ({ ...prev, logo: data.url }));
        toast.success("Logo subido exitosamente");
      } else {
        toast.error("Error al subir el logo");
      }
    } catch {
      toast.error("Error al subir el logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  useEffect(() => {
    if (
      session?.user?.role &&
      THEME_ALLOWED_ROLES.includes(session.user.role)
    ) {
      fetchThemePreferences();
      fetchChurchInfo();
    } else {
      setLoading(false);
    }
  }, [session]);

  // Only block users below ADMIN_IGLESIA
  if (!session?.user || !THEME_ALLOWED_ROLES.includes(session.user.role)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso Requerido</h2>
            <p className="text-muted-foreground">
              Esta configuración está disponible para Pastores y Administradores
              de la iglesia.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const saveThemePreferences = async () => {
    if (!themePreference) return;

    setSaving(true);
    try {
      const saveOps: Promise<Response | null>[] = [
        fetch("/api/theme-preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(themePreference),
        }),
      ];

      if (churchInfo.name.trim()) {
        saveOps.push(
          fetch("/api/church/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(churchInfo),
          }),
        );
      }

      const [themeRes, profileRes] = await Promise.all(saveOps);

      if (themeRes?.ok) {
        applyThemeChanges();
      }
      if (profileRes && !profileRes.ok) {
        toast.error("Error al guardar datos de la iglesia");
      } else {
        toast.success("Configuración guardada exitosamente");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    try {
      const response = await fetch("/api/theme-preferences", {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        setThemePreference(data);
        toast.success("Tema restablecido a valores por defecto");
        applyThemeChanges();
      } else {
        toast.error("Error al restablecer tema");
      }
    } catch (error) {
      console.error("Error resetting theme:", error);
      toast.error("Error al restablecer tema");
    }
  };

  const applyThemeChanges = () => {
    if (!themePreference) return;

    const root = document.documentElement;
    const mode =
      themePreference.themeMode === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : themePreference.themeMode;

    // Apply theme mode
    root.classList.remove("light", "dark");
    root.classList.add(mode);

    // Apply custom colors if they exist
    const colors = mode === "dark" ? DEFAULT_COLORS.dark : DEFAULT_COLORS.light;

    if (themePreference.primaryColor) {
      root.style.setProperty("--primary", themePreference.primaryColor);
    } else {
      root.style.setProperty("--primary", colors.primary);
    }

    if (themePreference.secondaryColor) {
      root.style.setProperty("--secondary", themePreference.secondaryColor);
    } else {
      root.style.setProperty("--secondary", colors.secondary);
    }

    if (themePreference.accentColor) {
      root.style.setProperty("--accent", themePreference.accentColor);
    } else {
      root.style.setProperty("--accent", colors.accent);
    }

    if (themePreference.backgroundColor) {
      root.style.setProperty("--background", themePreference.backgroundColor);
    } else {
      root.style.setProperty("--background", colors.background);
    }

    if (themePreference.borderRadius) {
      root.style.setProperty("--radius", themePreference.borderRadius);
    } else {
      root.style.setProperty("--radius", "0.5rem");
    }

    // Apply font family
    if (themePreference.fontFamily) {
      document.body.style.fontFamily = themePreference.fontFamily;
    }

    // Apply compact mode
    if (themePreference.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }
  };

  const updateThemePreference = (key: keyof ThemePreference, value: any) => {
    if (!themePreference) return;

    setThemePreference((prev) => ({
      ...prev!,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!themePreference) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Error al cargar configuración de tema
          </h1>
          <Button onClick={fetchThemePreferences}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Configuración
      </Link>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Tema</h1>
          <p className="text-muted-foreground">
            Personaliza la apariencia y colores del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? "Ocultar Vista Previa" : "Vista Previa"}
          </Button>
          <Button variant="outline" onClick={resetToDefault} className="gap-2">
            <Undo2 className="h-4 w-4" />
            Restablecer
          </Button>
          <Button
            onClick={saveThemePreferences}
            disabled={saving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {/* Theme Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa del Tema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThemePreview theme={themePreference} />
          </CardContent>
        </Card>
      )}

      {/* Theme Configuration */}
      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors" className="gap-1.5 cursor-pointer">
            <Palette className="h-3.5 w-3.5" />
            Colores
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-1.5 cursor-pointer">
            <Type className="h-3.5 w-3.5" />
            Tipografía
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-1.5 cursor-pointer">
            <Layout className="h-3.5 w-3.5" />
            Diseño
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-1.5 cursor-pointer">
            <Settings className="h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="iglesia" className="gap-1.5 cursor-pointer">
            <Building2 className="h-3.5 w-3.5" />
            Iglesia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          {/* Quick Color Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Presets Rápidos</CardTitle>
              <CardDescription>
                Aplica una combinación de colores con un clic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      updateThemePreference("primaryColor", preset.colors[0]);
                      updateThemePreference("secondaryColor", preset.colors[1]);
                      updateThemePreference("accentColor", preset.colors[2]);
                    }}
                    className="flex flex-col items-start gap-2 p-3 border-2 rounded-lg hover:border-[hsl(var(--brand-gold)/0.5)] hover:bg-[hsl(var(--accent)/0.15)] transition-all text-left"
                  >
                    <div className="flex gap-1">
                      {preset.colors.map((c, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-white/20"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium leading-tight">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Colores</CardTitle>
              <CardDescription>
                Personaliza los colores principales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode */}
              <div className="space-y-2">
                <Label>Modo de Tema</Label>
                <Select
                  value={themePreference.themeMode}
                  onValueChange={(value: "light" | "dark" | "auto") =>
                    updateThemePreference("themeMode", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Color Customization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ColorPicker
                  label="Color Primario"
                  value={themePreference.primaryColor}
                  onChange={(value) =>
                    updateThemePreference("primaryColor", value)
                  }
                  defaultValue={
                    themePreference.themeMode === "dark"
                      ? DEFAULT_COLORS.dark.primary
                      : DEFAULT_COLORS.light.primary
                  }
                />
                <ColorPicker
                  label="Color Secundario"
                  value={themePreference.secondaryColor}
                  onChange={(value) =>
                    updateThemePreference("secondaryColor", value)
                  }
                  defaultValue={
                    themePreference.themeMode === "dark"
                      ? DEFAULT_COLORS.dark.secondary
                      : DEFAULT_COLORS.light.secondary
                  }
                />
                <ColorPicker
                  label="Color de Acento"
                  value={themePreference.accentColor}
                  onChange={(value) =>
                    updateThemePreference("accentColor", value)
                  }
                  defaultValue={
                    themePreference.themeMode === "dark"
                      ? DEFAULT_COLORS.dark.accent
                      : DEFAULT_COLORS.light.accent
                  }
                />
                <ColorPicker
                  label="Color Destructivo"
                  value={themePreference.destructiveColor}
                  onChange={(value) =>
                    updateThemePreference("destructiveColor", value)
                  }
                  defaultValue={
                    themePreference.themeMode === "dark"
                      ? DEFAULT_COLORS.dark.destructive
                      : DEFAULT_COLORS.light.destructive
                  }
                />
                <ColorPicker
                  label="Color de Fondo"
                  value={themePreference.backgroundColor}
                  onChange={(value) =>
                    updateThemePreference("backgroundColor", value)
                  }
                  defaultValue={
                    themePreference.themeMode === "dark"
                      ? DEFAULT_COLORS.dark.background
                      : DEFAULT_COLORS.light.background
                  }
                />
                <ColorPicker
                  label="Color de Texto"
                  value={themePreference.foregroundColor}
                  onChange={(value) =>
                    updateThemePreference("foregroundColor", value)
                  }
                  defaultValue={
                    themePreference.themeMode === "dark"
                      ? DEFAULT_COLORS.dark.foreground
                      : DEFAULT_COLORS.light.foreground
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Tipografía</CardTitle>
              <CardDescription>
                Personaliza las fuentes y tamaños de texto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Familia de Fuente</Label>
                  <Select
                    value={themePreference.fontFamily || "Inter"}
                    onValueChange={(value) =>
                      updateThemePreference("fontFamily", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Source Sans Pro">
                        Source Sans Pro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tamaño de Fuente</Label>
                  <Select
                    value={themePreference.fontSize || "medium"}
                    onValueChange={(
                      value: "small" | "medium" | "large" | "xl",
                    ) => updateThemePreference("fontSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeño</SelectItem>
                      <SelectItem value="medium">Mediano</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                      <SelectItem value="xl">Extra Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Diseño</CardTitle>
              <CardDescription>
                Personaliza el diseño y espaciado del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Radio de Bordes</Label>
                  <Select
                    value={themePreference.borderRadius || "0.5rem"}
                    onValueChange={(value) =>
                      updateThemePreference("borderRadius", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sin bordes redondeados</SelectItem>
                      <SelectItem value="0.25rem">Pequeño</SelectItem>
                      <SelectItem value="0.5rem">Mediano</SelectItem>
                      <SelectItem value="0.75rem">Grande</SelectItem>
                      <SelectItem value="1rem">Extra Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Compacto</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduce el espaciado entre elementos
                    </p>
                  </div>
                  <Switch
                    checked={themePreference.compactMode}
                    onCheckedChange={(checked) =>
                      updateThemePreference("compactMode", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>
                Configuraciones generales del tema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Nombre del Tema</Label>
                <Input
                  value={themePreference.themeName}
                  onChange={(e) =>
                    updateThemePreference("themeName", e.target.value)
                  }
                  placeholder="Mi tema personalizado"
                />
              </div>

              <div className="space-y-2">
                <Label>URL del Favicon</Label>
                <Input
                  value={themePreference.faviconUrl || ""}
                  onChange={(e) =>
                    updateThemePreference("faviconUrl", e.target.value)
                  }
                  placeholder="https://tusitio.com/favicon.ico"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema Público</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que otros usuarios copien este tema
                  </p>
                </div>
                <Switch
                  checked={themePreference.isPublic}
                  onCheckedChange={(checked) =>
                    updateThemePreference("isPublic", checked)
                  }
                />
              </div>

              {themePreference.isPublic && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Público</Badge>
                    <span className="text-sm text-muted-foreground">
                      Este tema está disponible para otros usuarios
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── IGLESIA TAB ── Church info + logo, merges Perfil de la Iglesia colors tab */}
        <TabsContent value="iglesia" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Datos de la Iglesia
              </CardTitle>
              <CardDescription>
                Información, logo y datos de contacto de tu iglesia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo upload */}
              <div className="space-y-3">
                <Label>Logo de la Iglesia</Label>
                <div className="flex items-start gap-4">
                  {churchInfo.logo ? (
                    <img
                      src={churchInfo.logo}
                      alt="Logo"
                      className="w-24 h-24 object-contain rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                      <Building2 size={28} />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploadingLogo}
                      onClick={() =>
                        document.getElementById("logo-upload-theme")?.click()
                      }
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingLogo ? "Subiendo..." : "Subir Logo"}
                    </Button>
                    <input
                      id="logo-upload-theme"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                    {churchInfo.logo && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() =>
                          setChurchInfo((prev) => ({ ...prev, logo: "" }))
                        }
                      >
                        Eliminar
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, GIF · máx. 2MB
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Church info fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Nombre de la Iglesia{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={churchInfo.name}
                    onChange={(e) =>
                      setChurchInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Iglesia Central ..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={churchInfo.email}
                    onChange={(e) =>
                      setChurchInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="contacto@iglesia.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input
                    value={churchInfo.phone}
                    onChange={(e) =>
                      setChurchInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sitio Web</Label>
                  <Input
                    value={churchInfo.website}
                    onChange={(e) =>
                      setChurchInfo((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    placeholder="https://iglesia.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Dirección</Label>
                  <Input
                    value={churchInfo.address}
                    onChange={(e) =>
                      setChurchInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Calle Principal 123, Ciudad"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={churchInfo.description}
                    onChange={(e) =>
                      setChurchInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Una iglesia comprometida con la comunidad..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
