const fs = require('fs');
const filePath = 'app/(platform)/platform/_components/enhanced-church-management.tsx';
let content = fs.readFileSync(filePath, 'utf8');
// 1. Add Switch import if not exists
if (!content.includes("from '@/components/ui/switch'")) {
  content = content.replace(
    "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'",
    "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'\nimport { Switch } from '@/components/ui/switch'"
  );
}
// 2. Add state for agents and overrides after existing states
const stateInsertion = `
  const [agents, setAgents] = useState<any[]>([])
  const [overrides, setOverrides] = useState<any[]>([])
  const [agentsLoading, setAgentsLoading] = useState(false)
`;
if (!content.includes('const [agents, setAgents]')) {
  content = content.replace(
    'const [deleteLoading, setDeleteLoading] = useState(false)',
    'const [deleteLoading, setDeleteLoading] = useState(false)' + stateInsertion
  );
}
// 3. Add fetch function for agents and overrides
const fetchFunction = `
  const fetchAgentsAndOverrides = async (churchId: string) => {
    try {
      setAgentsLoading(true)
      // Fetch all agents
      const agentsRes = await fetch('/api/platform/agents')
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        setAgents(agentsData.agents || [])
      }
      // Fetch overrides for this church
      const overridesRes = await fetch(\`/api/platform/churches/\${churchId}/overrides\`)
      if (overridesRes.ok) {
        const overridesData = await overridesRes.json()
        setOverrides(overridesData.overrides || [])
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setAgentsLoading(false)
    }
  }
  const handleAgentToggle = async (agent: any, override: any) => {
    if (!selectedChurch) return
    const newStatus = override ? !override.isEnabled : !agent.isEnabled
    try {
      if (override) {
        // Update existing override
        await fetch(\`/api/platform/churches/\${selectedChurch.id}/overrides/\${override.id}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isEnabled: newStatus, reason: 'Updated via UI' })
        })
      } else {
        // Create new override
        await fetch(\`/api/platform/churches/\${selectedChurch.id}/overrides\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId: agent.agentId, isEnabled: newStatus, reason: 'Created via UI' })
        })
      }
      // Refresh overrides
      await fetchAgentsAndOverrides(selectedChurch.id)
      toast.success('Override actualizado')
    } catch (error) {
      console.error('Error toggling agent:', error)
      toast.error('Error al actualizar override')
    }
  }
  const handleResetOverride = async (agent: any) => {
    if (!selectedChurch) return
    const override = overrides.find(o => o.agentId === agent.agentId)
    if (!override) return
    try {
      await fetch(\`/api/platform/churches/\${selectedChurch.id}/overrides/\${override.id}\`, {
        method: 'DELETE'
      })
      await fetchAgentsAndOverrides(selectedChurch.id)
      toast.success('Override eliminado')
    } catch (error) {
      console.error('Error resetting override:', error)
      toast.error('Error al eliminar override')
    }
  }
`;
if (!content.includes('const fetchAgentsAndOverrides')) {
  content = content.replace(
    'const fetchChurches = async () => {',
    fetchFunction + '\n  const fetchChurches = async () => {'
  );
}
// 4. Call fetchAgentsAndOverrides when modal opens
const modalOpenEffect = `
  useEffect(() => {
    if (showChurchDetails && selectedChurch) {
      fetchAgentsAndOverrides(selectedChurch.id)
    }
  }, [showChurchDetails, selectedChurch])
`;
if (!content.includes('fetchAgentsAndOverrides(selectedChurch.id)')) {
  content = content.replace(
    'const fetchChurches = async () => {',
    modalOpenEffect + '\n  const fetchChurches = async () => {'
  );
}
// 5. Add Agents tab trigger
content = content.replace(
  '<TabsTrigger value="activity">Actividad</TabsTrigger>',
  '<TabsTrigger value="activity">Actividad</TabsTrigger>\n                  <TabsTrigger value="agents">Agentes IA</TabsTrigger>'
);
// 6. Add Agents tab content
const agentsTabContent = `
                <TabsContent value="agents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Control de Agentes IA</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Overrides activos: <strong>{overrides.length}</strong> | Los overrides manuales tienen prioridad sobre la configuraci?n de plataforma.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {agentsLoading ? (
                        <div className="text-center py-8">
                          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Cargando agentes...</p>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {agents.map((agent) => {
                            const override = overrides.find(o => o.agentId === agent.agentId)
                            const effectiveStatus = override ? override.isEnabled : agent.isEnabled
                            return (
                              <div key={agent.agentId} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">Ag. {agent.agentId}: {agent.agentName}</p>
                                    {override && (
                                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                        Override
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Estado: <strong>{effectiveStatus ? "ACTIVO" : "INACTIVO"}</strong>
                                    {override && \` (Platform: \${agent.isEnabled ? "ON" : "OFF"} ? Override: \${override.isEnabled ? "ON" : "OFF"})\`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={effectiveStatus}
                                    onCheckedChange={() => handleAgentToggle(agent, override)}
                                  />
                                  {override && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleResetOverride(agent)}
                                    >
                                      Reset
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
`;
content = content.replace(
  '</Tabs>\n            </div>',
  agentsTabContent + '\n              </Tabs>\n            </div>'
);
fs.writeFileSync(filePath, content, 'utf8');
console.log('? Church Agents tab integrated successfully');
