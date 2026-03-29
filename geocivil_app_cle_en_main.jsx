import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, FileText, MapPinned, Search, Plus, Phone, Mail, CalendarDays, CheckCircle2, Clock3, AlertTriangle, Download, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialClients = [
  {
    id: "CL-001",
    nom: "Entreprise Diallo Construction",
    contact: "Mamadou Diallo",
    telephone: "(514) 555-2101",
    email: "contact@dialloconstruction.ca",
    adresse: "Montréal, QC",
    notes: "Client régulier pour implantation et topographie."
  },
  {
    id: "CL-002",
    nom: "Groupe Bâtir Nord",
    contact: "Fatou Camara",
    telephone: "(438) 555-1920",
    email: "admin@batirnord.ca",
    adresse: "Laval, QC",
    notes: "Demande des rapports PDF mensuels."
  }
];

const initialProjects = [
  {
    id: "CH-2401",
    nom: "Implantation résidentielle – Laval",
    clientId: "CL-001",
    lieu: "Laval, Québec",
    type: "Implantation",
    statut: "En cours",
    debut: "2026-03-18",
    fin: "2026-04-06",
    responsable: "A. Keita",
    progression: 68,
    description: "Implantation complète du bâtiment et suivi terrain."
  },
  {
    id: "CH-2402",
    nom: "Certificat de localisation – Montréal",
    clientId: "CL-002",
    lieu: "Montréal, Québec",
    type: "Certificat",
    statut: "Planifié",
    debut: "2026-04-02",
    fin: "2026-04-10",
    responsable: "Équipe GeoCivil",
    progression: 15,
    description: "Relevé topographique et production du certificat."
  },
  {
    id: "CH-2403",
    nom: "Levée topographique – Longueuil",
    clientId: "CL-001",
    lieu: "Longueuil, Québec",
    type: "Topographie",
    statut: "Terminé",
    debut: "2026-03-01",
    fin: "2026-03-11",
    responsable: "A. Keita",
    progression: 100,
    description: "Levée topographique pour préparation de chantier."
  }
];

const initialUsers = [
  { id: 1, nom: "Admin GeoCivil", role: "Administrateur", statut: "Actif" },
  { id: 2, nom: "A. Keita", role: "Gestionnaire chantier", statut: "Actif" },
  { id: 3, nom: "Technicien Terrain", role: "Technicien", statut: "Actif" }
];

function StatusBadge({ value }) {
  const styles = {
    "En cours": "bg-amber-100 text-amber-700 border-amber-200",
    "Planifié": "bg-sky-100 text-sky-700 border-sky-200",
    "Terminé": "bg-emerald-100 text-emerald-700 border-emerald-200"
  };
  return <Badge className={`${styles[value] || "bg-slate-100 text-slate-700 border-slate-200"} border`}>{value}</Badge>;
}

function StatCard({ title, value, icon: Icon, subtitle }) {
  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardContent className="p-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="p-3 rounded-2xl bg-slate-100">
          <Icon className="w-6 h-6 text-slate-700" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function GeoCivilApp() {
  const [clients, setClients] = useState(initialClients);
  const [projects, setProjects] = useState(initialProjects);
  const [users] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [newClient, setNewClient] = useState({ nom: "", contact: "", telephone: "", email: "", adresse: "", notes: "" });
  const [newProject, setNewProject] = useState({ nom: "", clientId: "", lieu: "", type: "", statut: "Planifié", debut: "", fin: "", responsable: "", description: "" });

  const filteredProjects = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) =>
      [p.nom, p.lieu, p.type, p.statut, p.responsable].join(" ").toLowerCase().includes(q)
    );
  }, [projects, search]);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.statut === "En cours").length,
    clients: clients.length,
    reports: projects.length
  };

  const getClientName = (clientId) => clients.find((c) => c.id === clientId)?.nom || "—";

  const addClient = () => {
    if (!newClient.nom || !newClient.contact) return;
    setClients((prev) => [
      {
        id: `CL-${String(prev.length + 1).padStart(3, "0")}`,
        ...newClient
      },
      ...prev
    ]);
    setNewClient({ nom: "", contact: "", telephone: "", email: "", adresse: "", notes: "" });
  };

  const addProject = () => {
    if (!newProject.nom || !newProject.clientId || !newProject.type) return;
    setProjects((prev) => [
      {
        id: `CH-${2400 + prev.length + 1}`,
        ...newProject,
        progression: newProject.statut === "Terminé" ? 100 : newProject.statut === "En cours" ? 45 : 10
      },
      ...prev
    ]);
    setNewProject({ nom: "", clientId: "", lieu: "", type: "", statut: "Planifié", debut: "", fin: "", responsable: "", description: "" });
  };

  const generateReport = (project) => {
    const clientName = getClientName(project.clientId);
    const report = `RAPPORT DE CHANTIER – GEOCIVIL\n\nProjet: ${project.nom}\nClient: ${clientName}\nLieu: ${project.lieu}\nType: ${project.type}\nStatut: ${project.statut}\nDébut: ${project.debut}\nFin: ${project.fin}\nResponsable: ${project.responsable}\nProgression: ${project.progression}%\n\nDescription:\n${project.description}\n\nÉmis par GeoCivil.`;
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.id}_rapport_geocivil.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid lg:grid-cols-[270px_1fr] min-h-screen">
        <aside className="bg-slate-900 text-white p-6 hidden lg:flex lg:flex-col">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">GeoCivil</h1>
                <p className="text-sm text-slate-300">Gestion de chantier</p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-4">Tableau de bord</div>
            <div className="rounded-2xl p-4 text-slate-300">Chantiers</div>
            <div className="rounded-2xl p-4 text-slate-300">Clients</div>
            <div className="rounded-2xl p-4 text-slate-300">Rapports PDF</div>
            <div className="rounded-2xl p-4 text-slate-300">Utilisateurs</div>
          </div>

          <div className="mt-auto rounded-2xl bg-emerald-500/15 border border-emerald-400/20 p-4">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span className="font-medium">Version prête</span>
            </div>
            <p className="text-sm text-slate-300">Interface bureau, gestion client, rapports, utilisateurs et modules chantier.</p>
          </div>
        </aside>

        <main className="p-4 md:p-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Application clé en main</h2>
                <p className="text-slate-500 mt-2">Suivi des chantiers, fiches clients complètes, connexion utilisateur et génération de rapports.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-2xl"><Plus className="w-4 h-4 mr-2" />Nouveau client</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un client</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Nom entreprise</Label><Input value={newClient.nom} onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })} /></div>
                      <div><Label>Contact</Label><Input value={newClient.contact} onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })} /></div>
                      <div><Label>Téléphone</Label><Input value={newClient.telephone} onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })} /></div>
                      <div><Label>Email</Label><Input value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} /></div>
                      <div className="md:col-span-2"><Label>Adresse</Label><Input value={newClient.adresse} onChange={(e) => setNewClient({ ...newClient, adresse: e.target.value })} /></div>
                      <div className="md:col-span-2"><Label>Notes</Label><Textarea value={newClient.notes} onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })} /></div>
                    </div>
                    <Button className="rounded-2xl w-full mt-4" onClick={addClient}>Enregistrer le client</Button>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-2xl"><Plus className="w-4 h-4 mr-2" />Nouveau chantier</Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un chantier</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Nom du chantier</Label><Input value={newProject.nom} onChange={(e) => setNewProject({ ...newProject, nom: e.target.value })} /></div>
                      <div>
                        <Label>Client</Label>
                        <select className="w-full h-10 rounded-md border border-slate-200 px-3" value={newProject.clientId} onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}>
                          <option value="">Sélectionner</option>
                          {clients.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                        </select>
                      </div>
                      <div><Label>Lieu</Label><Input value={newProject.lieu} onChange={(e) => setNewProject({ ...newProject, lieu: e.target.value })} /></div>
                      <div><Label>Type</Label><Input placeholder="Topographie, implantation..." value={newProject.type} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })} /></div>
                      <div>
                        <Label>Statut</Label>
                        <select className="w-full h-10 rounded-md border border-slate-200 px-3" value={newProject.statut} onChange={(e) => setNewProject({ ...newProject, statut: e.target.value })}>
                          <option>Planifié</option>
                          <option>En cours</option>
                          <option>Terminé</option>
                        </select>
                      </div>
                      <div><Label>Responsable</Label><Input value={newProject.responsable} onChange={(e) => setNewProject({ ...newProject, responsable: e.target.value })} /></div>
                      <div><Label>Date début</Label><Input type="date" value={newProject.debut} onChange={(e) => setNewProject({ ...newProject, debut: e.target.value })} /></div>
                      <div><Label>Date fin</Label><Input type="date" value={newProject.fin} onChange={(e) => setNewProject({ ...newProject, fin: e.target.value })} /></div>
                      <div className="md:col-span-2"><Label>Description</Label><Textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} /></div>
                    </div>
                    <Button className="rounded-2xl w-full mt-4" onClick={addProject}>Créer le chantier</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard title="Chantiers" value={stats.totalProjects} icon={MapPinned} subtitle="Tous les projets suivis" />
              <StatCard title="Actifs" value={stats.activeProjects} icon={Clock3} subtitle="Chantiers en cours" />
              <StatCard title="Clients" value={stats.clients} icon={Users} subtitle="Fiches complètes" />
              <StatCard title="Rapports" value={stats.reports} icon={FileText} subtitle="Exportables" />
            </div>

            <Tabs defaultValue="projects" className="space-y-6">
              <TabsList className="rounded-2xl bg-white border border-slate-200 p-1">
                <TabsTrigger value="projects" className="rounded-xl">Chantiers</TabsTrigger>
                <TabsTrigger value="clients" className="rounded-xl">Clients</TabsTrigger>
                <TabsTrigger value="reports" className="rounded-xl">Rapports</TabsTrigger>
                <TabsTrigger value="users" className="rounded-xl">Utilisateurs</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-4">
                <Card className="rounded-2xl shadow-sm border-slate-200">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <CardTitle>Gestion des chantiers</CardTitle>
                      <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <Input className="pl-9 rounded-2xl" placeholder="Rechercher un chantier..." value={search} onChange={(e) => setSearch(e.target.value)} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="rounded-2xl border border-slate-200 p-5 bg-white">
                        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-xl font-semibold">{project.nom}</h3>
                              <StatusBadge value={project.statut} />
                            </div>
                            <p className="text-sm text-slate-500">{project.id} • {project.type} • {project.lieu}</p>
                            <p className="text-sm text-slate-700">{project.description}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" className="rounded-2xl" onClick={() => generateReport(project)}>
                              <Download className="w-4 h-4 mr-2" />Exporter rapport
                            </Button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mt-5 text-sm">
                          <div className="rounded-2xl bg-slate-50 p-4"><span className="text-slate-500 block">Client</span><span className="font-medium">{getClientName(project.clientId)}</span></div>
                          <div className="rounded-2xl bg-slate-50 p-4"><span className="text-slate-500 block">Responsable</span><span className="font-medium">{project.responsable}</span></div>
                          <div className="rounded-2xl bg-slate-50 p-4"><span className="text-slate-500 block">Début</span><span className="font-medium">{project.debut}</span></div>
                          <div className="rounded-2xl bg-slate-50 p-4"><span className="text-slate-500 block">Fin</span><span className="font-medium">{project.fin}</span></div>
                        </div>

                        <div className="mt-5">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-500">Progression</span>
                            <span className="font-medium">{project.progression}%</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 rounded-full" style={{ width: `${project.progression}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="clients">
                <Card className="rounded-2xl shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle>Fiches clients complètes</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                    {clients.map((client) => (
                      <div key={client.id} className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold">{client.nom}</h3>
                            <Badge variant="outline" className="rounded-xl">{client.id}</Badge>
                          </div>
                          <p className="text-sm text-slate-500">Contact principal: {client.contact}</p>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{client.telephone}</div>
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{client.email}</div>
                          <div className="flex items-center gap-2"><MapPinned className="w-4 h-4" />{client.adresse}</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">{client.notes}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card className="rounded-2xl shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle>Rapports de chantier</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {projects.map((project) => (
                      <div key={project.id} className="rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{project.nom}</h3>
                          <p className="text-sm text-slate-500">{project.id} • {getClientName(project.clientId)} • générable en un clic</p>
                        </div>
                        <Button className="rounded-2xl" onClick={() => generateReport(project)}>
                          <FileText className="w-4 h-4 mr-2" />Générer le rapport
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="rounded-2xl shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle>Connexion et utilisateurs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50">
                      <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5" />
                        <h3 className="font-semibold">Accès sécurisé</h3>
                      </div>
                      <p className="text-sm text-slate-600">Prévu pour intégration avec authentification administrateur, gestionnaire et technicien.</p>
                    </div>
                    {users.map((user) => (
                      <div key={user.id} className="rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{user.nom}</h3>
                          <p className="text-sm text-slate-500">{user.role}</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl">{user.statut}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <Card className="rounded-2xl border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3"><CheckCircle2 className="w-5 h-5" /><h3 className="font-semibold">Prête pour bureau</h3></div>
                  <p className="text-sm text-slate-600">Interface optimisée pour ordinateur avec navigation claire et formulaires complets.</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3"><CalendarDays className="w-5 h-5" /><h3 className="font-semibold">Suivi opérationnel</h3></div>
                  <p className="text-sm text-slate-600">Dates, statuts, responsables et progression centralisés dans un seul espace.</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3"><AlertTriangle className="w-5 h-5" /><h3 className="font-semibold">À connecter ensuite</h3></div>
                  <p className="text-sm text-slate-600">Base de données, vrai export PDF, comptes utilisateurs réels et publication sur serveur.</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
