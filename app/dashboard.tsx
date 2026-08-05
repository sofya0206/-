"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  Copy,
  CreditCard,
  Database,
  ExternalLink,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PackageCheck,
  Phone,
  Play,
  Plus,
  Search,
  Save,
  Send,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  Video,
  Wallet,
  RefreshCw,
  Trash2,
  Upload,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

type Tab = "overview" | "youtube" | "sales" | "crm" | "finance" | "product" | "automations";

type Client = {
  id: number;
  name: string;
  contact: string;
  ageGroup: string;
  incomeBand: string;
  source: string;
  video: string;
  utm: string;
  stage: string;
  manager: string;
  revenue: number;
  responseMinutes: number;
  tags: string;
  notes?: string;
  nextFollowUp?: string | null;
  dialogAt?: string | null;
  callAt?: string | null;
  saleAt?: string | null;
  callDuration?: number;
  callOutcome?: string;
  createdAt: string;
  lastActivity: string;
};

type Expense = { id: number; category: string; description: string; amount: number; spentAt: string; videoId?: string | null; createdAt?: string };
type DbManager = { id: number; name: string; telegram: string; email: string; plan: number; status: string; createdAt: string };
type ProductData = { id: number; period: string; activeStudents: number; casesCount: number; nps: number; completionRate: number; atRisk: number; avgResultDays: number };
type VideoData = { id: number; youtubeId: string; title: string; publishedAt: string; utm: string; views: number; leads: number; dialogs: number; calls: number; sales: number; revenue: number; spend: number; updatedAt: string };
type Reminder = { id: number; clientId: number; manager: string; message: string; remindAt: string; status: string; createdAt: string };
type ActivityEvent = { id: number; type: string; entityId?: number | null; title: string; detail: string; createdAt: string };
type IntegrationStatus = {
  telegram: { configured: boolean; botName?: string | null; missing: string[] };
  youtube: { configured: boolean; missing: string[] };
  webhook: { configured: boolean; url: string; missing: string[] };
};

const nav: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Обзор", icon: LayoutDashboard },
  { id: "youtube", label: "YouTube", icon: Play },
  { id: "sales", label: "Отдел продаж", icon: BarChart3 },
  { id: "crm", label: "CRM", icon: UsersRound },
  { id: "finance", label: "Финансы", icon: Wallet },
  { id: "product", label: "Продукт", icon: PackageCheck },
  { id: "automations", label: "Автоматизации", icon: Zap },
];

const initialClients: Client[] = [
  { id: 1, name: "Анна Волкова", contact: "@anna_volkova", ageGroup: "25–34", incomeBand: "150–250 тыс. ₽", source: "YouTube", video: "Как выйти на доход 300к в 2026", utm: "yt_income_300", stage: "Звонок", manager: "Мария", revenue: 0, responseMinutes: 4, tags: "горячий,дожим", createdAt: "Сегодня, 10:42", lastActivity: "Сегодня, 11:26" },
  { id: 2, name: "Илья Козлов", contact: "@ikozlov", ageGroup: "18–24", incomeBand: "80–150 тыс. ₽", source: "YouTube", video: "Разбор 5 ошибок новичков", utm: "yt_errors_5", stage: "Диалог", manager: "Алексей", revenue: 0, responseMinutes: 9, tags: "новый", createdAt: "Сегодня, 11:08", lastActivity: "Сегодня, 11:18" },
  { id: 3, name: "Дарья Смирнова", contact: "@dasha_smir", ageGroup: "25–34", incomeBand: "250+ тыс. ₽", source: "YouTube", video: "Кейс: с нуля до первого миллиона", utm: "yt_case_million", stage: "Оплачено", manager: "Мария", revenue: 149000, responseMinutes: 2, tags: "vip,оплата", createdAt: "Вчера, 15:30", lastActivity: "Сегодня, 10:42" },
  { id: 4, name: "Максим Соколов", contact: "@max_sokolov", ageGroup: "35–44", incomeBand: "150–250 тыс. ₽", source: "YouTube", video: "7 инструментов для роста", utm: "yt_tools_growth", stage: "Новая", manager: "Не назначен", revenue: 0, responseMinutes: 0, tags: "новый", createdAt: "Сегодня, 12:02", lastActivity: "12 мин назад" },
  { id: 5, name: "Елена Миронова", contact: "@elena_mir", ageGroup: "25–34", incomeBand: "80–150 тыс. ₽", source: "YouTube", video: "Как выбрать сильную нишу", utm: "yt_choose_niche", stage: "Думает", manager: "Денис", revenue: 0, responseMinutes: 16, tags: "дожим", createdAt: "3 авг, 18:04", lastActivity: "Вчера, 18:04" },
  { id: 6, name: "Роман Лебедев", contact: "@roman_leb", ageGroup: "35–44", incomeBand: "250+ тыс. ₽", source: "YouTube", video: "Как выйти на доход 300к в 2026", utm: "yt_income_300", stage: "Оплачено", manager: "Алексей", revenue: 129000, responseMinutes: 5, tags: "оплата", createdAt: "2 авг, 13:12", lastActivity: "2 авг, 16:30" },
  { id: 7, name: "Кира Орлова", contact: "@kira_orlova", ageGroup: "18–24", incomeBand: "до 80 тыс. ₽", source: "YouTube", video: "Разбор 5 ошибок новичков", utm: "yt_errors_5", stage: "Не целевой", manager: "Денис", revenue: 0, responseMinutes: 7, tags: "нецелевой", createdAt: "2 авг, 10:31", lastActivity: "2 авг, 11:02" },
];

const videos = [
  { title: "Как выйти на доход 300к в 2026", date: "28 июл", views: "324,8K", leads: 462, calls: 118, sales: 38, cr: "8,2%", revenue: "5,12 млн ₽", roi: "x12,4", accent: "blue" },
  { title: "Кейс: с нуля до первого миллиона", date: "22 июл", views: "186,2K", leads: 318, calls: 92, sales: 31, cr: "9,7%", revenue: "4,28 млн ₽", roi: "x16,8", accent: "lime" },
  { title: "7 инструментов для роста в 2026", date: "15 июл", views: "241,7K", leads: 286, calls: 71, sales: 22, cr: "7,7%", revenue: "2,93 млн ₽", roi: "x8,6", accent: "purple" },
  { title: "Разбор 5 ошибок новичков", date: "8 июл", views: "152,4K", leads: 229, calls: 62, sales: 18, cr: "7,9%", revenue: "2,41 млн ₽", roi: "x9,1", accent: "orange" },
  { title: "Как выбрать сильную нишу", date: "2 июл", views: "118,9K", leads: 174, calls: 45, sales: 12, cr: "6,9%", revenue: "1,61 млн ₽", roi: "x7,4", accent: "pink" },
];

const managers = [
  { name: "Мария Сергеева", initials: "МС", leads: 214, calls: 87, sales: 32, cr: "36,8%", response: "3:42", revenue: "4,31 млн ₽", plan: 112 },
  { name: "Алексей Белов", initials: "АБ", leads: 198, calls: 74, sales: 27, cr: "36,5%", response: "5:18", revenue: "3,58 млн ₽", plan: 96 },
  { name: "Денис Романов", initials: "ДР", leads: 186, calls: 69, sales: 21, cr: "30,4%", response: "8:06", revenue: "2,76 млн ₽", plan: 78 },
  { name: "Ольга Ларионова", initials: "ОЛ", leads: 167, calls: 58, sales: 18, cr: "31,0%", response: "6:24", revenue: "2,39 млн ₽", plan: 71 },
];

const formatMoney = (value: number) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";
const formatCompact = (value: number) => new Intl.NumberFormat("ru-RU", { notation: "compact", maximumFractionDigits: 1 }).format(value);
const percent = (value: number, total: number) => total ? Math.round(value / total * 1000) / 10 : 0;
const isDialogStage = (stage: string) => ["Диалог", "Звонок", "Думает", "Оплачено"].includes(stage);
const isCallStage = (stage: string) => ["Звонок", "Думает", "Оплачено"].includes(stage);

function Status({ value }: { value: string }) {
  return <span className={`status status-${value.toLowerCase().replace(" ", "-")}`}><i />{value}</span>;
}

function Trend({ value, positive = true }: { value: string; positive?: boolean }) {
  return <span className={positive ? "trend positive" : "trend negative"}>{positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{value}</span>;
}

function MetricCard({ label, value, change, positive = true, hint, icon: Icon }: { label: string; value: string; change: string; positive?: boolean; hint: string; icon: LucideIcon }) {
  return <article className="metric-card">
    <div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon size={17} /></span></div>
    <strong>{value}</strong>
    <div className="metric-bottom"><Trend value={change} positive={positive} /><span>{hint}</span></div>
  </article>;
}

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy?: string; action?: React.ReactNode }) {
  return <div className="section-heading">
    <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{copy && <p>{copy}</p>}</div>
    {action}
  </div>;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("Все статусы");
  const [period, setPeriod] = useState("1–31 июля 2026");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reportEnabled, setReportEnabled] = useState(true);
  const [nudgeEnabled, setNudgeEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [integrationOpen, setIntegrationOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dbManagers, setDbManagers] = useState<DbManager[]>([]);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [videoData, setVideoData] = useState<VideoData[]>([]);
  const [videoSource, setVideoSource] = useState<"demo" | "youtube">("demo");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({ telegram: { configured: false, missing: [] }, youtube: { configured: false, missing: [] }, webhook: { configured: false, url: "/api/webhooks/leads", missing: [] } });

  useEffect(() => {
    fetch("/api/leads").then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (data.clients?.length) {
        const normalized = data.clients.map((client: Client) => ({ ...client, createdAt: client.createdAt.includes("T") ? "Сегодня" : client.createdAt }));
        setClients(normalized);
      }
    }).catch(() => undefined);
    fetch("/api/expenses").then(r => r.ok ? r.json() : Promise.reject()).then(data => setExpenses(data.expenses ?? [])).catch(() => undefined);
    fetch("/api/managers").then(r => r.ok ? r.json() : Promise.reject()).then(data => setDbManagers(data.managers ?? [])).catch(() => undefined);
    fetch("/api/product").then(r => r.ok ? r.json() : Promise.reject()).then(data => setProductData(data.product ?? null)).catch(() => undefined);
    fetch("/api/integrations/youtube").then(r => r.ok ? r.json() : Promise.reject()).then(data => { setVideoData(data.videos ?? []); setVideoSource(data.source === "youtube" ? "youtube" : "demo"); }).catch(() => undefined);
    fetch("/api/reminders").then(r => r.ok ? r.json() : Promise.reject()).then(data => setReminders(data.reminders ?? [])).catch(() => undefined);
    fetch("/api/activity").then(r => r.ok ? r.json() : Promise.reject()).then(data => setActivityEvents(data.events ?? [])).catch(() => undefined);
    fetch("/api/integrations/status").then(r => r.ok ? r.json() : Promise.reject()).then(data => setIntegrationStatus(data)).catch(() => undefined);
    fetch("/api/automation-settings").then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      for (const setting of data.settings ?? []) {
        if (setting.key === "lead_sync") setSyncEnabled(Boolean(setting.enabled));
        if (setting.key === "lead_nudges") setNudgeEnabled(Boolean(setting.enabled));
        if (setting.key === "daily_report") setReportEnabled(Boolean(setting.enabled));
      }
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredClients = useMemo(() => clients.filter(client => {
    const matchesSearch = `${client.name} ${client.contact} ${client.video} ${client.utm}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (stageFilter === "Все статусы" || client.stage === stageFilter);
  }), [clients, search, stageFilter]);

  const changeTab = (tab: Tab) => { setActiveTab(tab); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const updateClient = async (id: number, patch: Partial<Client>) => {
    const previous = clients.find(client => client.id === id);
    setClients(prev => prev.map(client => client.id === id ? { ...client, ...patch, lastActivity: "Только что" } : client));
    setActiveClient(prev => prev?.id === id ? { ...prev, ...patch, lastActivity: "Только что" } : prev);
    const response = await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) }).catch(() => null);
    if (!response?.ok) {
      if (previous) { setClients(prev => prev.map(client => client.id === id ? previous : client)); setActiveClient(previous); }
      setToast("Не удалось сохранить изменения");
      return;
    }
    setToast("Карточка клиента обновлена");
  };

  const persistToggle = (key: string, enabled: boolean) => {
    fetch("/api/automation-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, enabled }) }).catch(() => undefined);
  };

  const addClients = (rows: Client[]) => { setClients(prev => [...rows, ...prev]); setToast(rows.length > 1 ? `Импортировано заявок: ${rows.length}` : "Новая заявка добавлена"); };
  const addExpense = (expense: Expense) => { setExpenses(prev => [expense, ...prev]); setToast("Расход сохранён и учтён в P&L"); };
  const addManager = (manager: DbManager) => { setDbManagers(prev => [...prev, manager]); setToast("Менеджер добавлен в команду"); };
  const saveProduct = (product: ProductData) => { setProductData(product); setToast("Метрики продукта обновлены"); };
  const deleteClient = async (id: number) => { const response = await fetch(`/api/leads?id=${id}`, { method: "DELETE" }).catch(() => null); if (!response?.ok) { setToast("Не удалось удалить заявку"); return; } setClients(prev => prev.filter(client => client.id !== id)); setActiveClient(null); setToast("Заявка удалена"); };

  const runIntegration = async (kind: "telegram" | "youtube") => {
    const endpoint = kind === "telegram" ? "/api/integrations/telegram" : "/api/integrations/youtube";
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: kind === "telegram" ? JSON.stringify({ action: "daily_report" }) : undefined });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setToast(data.error === "Telegram не настроен" || data.error === "YouTube не настроен" ? "Сначала добавьте ключи в настройках подключения" : (data.error || "Не удалось выполнить операцию")); return; }
    if (kind === "youtube") {
      const refreshed = await fetch("/api/integrations/youtube").then(r => r.json()).catch(() => ({}));
      setVideoData(refreshed.videos ?? []);
      setVideoSource("youtube");
    }
    setToast(kind === "telegram" ? "Отчёт отправлен в Telegram" : `YouTube синхронизирован: ${data.synced} роликов`);
  };

  const refreshOperations = async () => {
    const [reminderResult, activityResult] = await Promise.all([
      fetch("/api/reminders").then(r => r.json()).catch(() => ({})),
      fetch("/api/activity").then(r => r.json()).catch(() => ({})),
    ]);
    setReminders(reminderResult.reminders ?? []);
    setActivityEvents(activityResult.events ?? []);
  };

  const runAutomation = async (action: "process_due" | "daily_report") => {
    const response = await fetch("/api/automations/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setToast(data.error === "Telegram не настроен" ? "Сначала подключите Telegram" : (data.error || "Не удалось запустить сценарий")); return; }
    await refreshOperations();
    setToast(action === "daily_report" ? "Отчёт отправлен в Telegram" : `Обработано напоминаний: ${data.processed}`);
  };

  const exportReport = () => {
    const rows = [["Ролик", "Просмотры", "Заявки", "Звонки", "Продажи", "Выручка"], ...videos.map(v => [v.title, v.views, v.leads, v.calls, v.sales, v.revenue])];
    const blob = new Blob([rows.map(r => r.join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "lumo-youtube-report.csv"; a.click(); URL.revokeObjectURL(url);
    setToast("Отчёт выгружен в CSV");
  };

  const exportClients = () => {
    const rows = [["Клиент", "Контакт", "Возраст", "Доход", "Статус", "Менеджер", "Ролик", "UTM", "Выручка"], ...filteredClients.map(client => [client.name, client.contact, client.ageGroup, client.incomeBand, client.stage, client.manager, client.video, client.utm, client.revenue])];
    const blob = new Blob(["\ufeff" + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "lumo-crm.csv"; a.click(); URL.revokeObjectURL(url);
    setToast("CRM выгружена в CSV");
  };

  const title = nav.find(item => item.id === activeTab)?.label ?? "Обзор";

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><strong>LUMO</strong><small>analytics</small></div>
      <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню"><X size={20} /></button>
      <nav>
        <span className="nav-label">РАБОЧЕЕ ПРОСТРАНСТВО</span>
        {nav.slice(0, 6).map(item => <button key={item.id} className={activeTab === item.id ? "active" : ""} onClick={() => changeTab(item.id)}><item.icon size={18} /><span>{item.label}</span>{item.id === "crm" && <b>{clients.length}</b>}</button>)}
        <span className="nav-label nav-label-second">СИСТЕМА</span>
        {nav.slice(6).map(item => <button key={item.id} className={activeTab === item.id ? "active" : ""} onClick={() => changeTab(item.id)}><item.icon size={18} /><span>{item.label}</span><em /></button>)}
        <button onClick={() => setIntegrationOpen(true)}><Settings size={18} /><span>Настройки</span></button>
      </nav>
      <div className="sidebar-card">
        <div><Bot size={18} /><span>Telegram-бот</span><i className={integrationStatus.telegram.configured ? "" : "offline"} /></div>
        <p>{integrationStatus.telegram.configured ? "Синхронизация работает" : "Ожидает подключения"}</p>
        <button onClick={() => changeTab("automations")}>Управлять <ChevronRight size={14} /></button>
      </div>
      <div className="profile"><span className="avatar">АК</span><div><strong>Александр К.</strong><small>Администратор</small></div><MoreHorizontal size={18} /></div>
    </aside>
    {mobileOpen && <button className="backdrop" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню" />}

    <main>
      <header className="topbar">
        <div className="topbar-title"><button className="menu-button" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div><small>Рабочее пространство /</small><strong>{title}</strong></div></div>
        <div className="topbar-actions">
          <label className="period-select"><CalendarDays size={16} /><select value={period} onChange={e => setPeriod(e.target.value)}><option>1–31 июля 2026</option><option>1–5 августа 2026</option><option>Последние 90 дней</option></select><ChevronDown size={14} /></label>
          <button className="icon-button" onClick={() => setToast("Новых уведомлений нет")} aria-label="Уведомления"><Bell size={18} /><i /></button>
          <button className="secondary-button desktop-only" onClick={exportReport}><Download size={16} /> Экспорт</button>
        </div>
      </header>

      <div className="content">
        {activeTab === "overview" && <Overview clients={clients} expenses={expenses} onOpen={changeTab} />}
        {activeTab === "youtube" && <Youtube clients={clients} expenses={expenses} videoData={videoData} videoSource={videoSource} exportReport={exportReport} />}
        {activeTab === "sales" && <Sales clients={clients} managers={dbManagers} onAddManager={() => setManagerOpen(true)} />}
        {activeTab === "crm" && <CRM clients={filteredClients} allClients={clients} search={search} setSearch={setSearch} filter={stageFilter} setFilter={setStageFilter} openClient={setActiveClient} onNewLead={() => setNewLeadOpen(true)} onImport={() => setImportOpen(true)} onExport={exportClients} />}
        {activeTab === "finance" && <Finance clients={clients} expenses={expenses} onAddExpense={() => setExpenseOpen(true)} />}
        {activeTab === "product" && <Product data={productData} onEdit={() => setProductOpen(true)} />}
        {activeTab === "automations" && <Automations reportEnabled={reportEnabled} setReportEnabled={(value) => { setReportEnabled(value); persistToggle("daily_report", value); }} nudgeEnabled={nudgeEnabled} setNudgeEnabled={(value) => { setNudgeEnabled(value); persistToggle("lead_nudges", value); }} syncEnabled={syncEnabled} setSyncEnabled={(value) => { setSyncEnabled(value); persistToggle("lead_sync", value); }} reminders={reminders} activityEvents={activityEvents} integrationStatus={integrationStatus} openSettings={() => setIntegrationOpen(true)} runAutomation={runAutomation} />}
      </div>
    </main>

    {activeClient && <ClientDrawer client={activeClient} close={() => setActiveClient(null)} updateClient={updateClient} openReminder={() => setReminderOpen(true)} deleteClient={deleteClient} setToast={setToast} />}
    {reminderOpen && activeClient && <ReminderModal client={activeClient} close={() => setReminderOpen(false)} done={async () => { setReminderOpen(false); await refreshOperations(); setToast(integrationStatus.telegram.configured ? "Напоминание создано" : "Напоминание сохранено — подключите Telegram для отправки"); }} />}
    {newLeadOpen && <NewLeadModal close={() => setNewLeadOpen(false)} done={(rows) => { setNewLeadOpen(false); addClients(rows); }} managers={dbManagers} />}
    {expenseOpen && <ExpenseModal close={() => setExpenseOpen(false)} done={(expense) => { setExpenseOpen(false); addExpense(expense); }} />}
    {managerOpen && <ManagerModal close={() => setManagerOpen(false)} done={(manager) => { setManagerOpen(false); addManager(manager); }} />}
    {importOpen && <ImportModal close={() => setImportOpen(false)} done={(rows) => { setImportOpen(false); addClients(rows); }} />}
    {integrationOpen && <IntegrationModal status={integrationStatus} close={() => setIntegrationOpen(false)} setToast={setToast} runIntegration={runIntegration} />}
    {productOpen && productData && <ProductModal data={productData} close={() => setProductOpen(false)} done={(product) => { setProductOpen(false); saveProduct(product); }} />}
    {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
  </div>;
}

type OverviewMetric = {
  label: string;
  value: string;
  change?: string;
  progress: number;
  progressLabel: string;
  progressValue: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
  featured?: boolean;
};

function OverviewMetricCard({ metric, onClick }: { metric: OverviewMetric; onClick: () => void }) {
  const Icon = metric.icon;
  return <button className={`overview-metric-card ${metric.tone}${metric.featured ? " featured" : ""}`} onClick={onClick}>
    <span className="overview-metric-top">
      <span className="overview-metric-label">{metric.label}</span>
      {metric.change && <span className="overview-metric-change"><ArrowUpRight size={14} />{metric.change}</span>}
      <span className="overview-metric-icon"><Icon size={19} /></span>
    </span>
    <strong>{metric.value}</strong>
    <span className="overview-metric-detail">{metric.detail}</span>
    <span className="overview-progress-copy"><span>{metric.progressLabel}</span><b>{metric.progressValue}</b></span>
    <span className="overview-progress" aria-hidden="true"><i style={{ width: `${Math.min(metric.progress, 100)}%` }} /></span>
  </button>;
}

function Overview({ clients, expenses, onOpen }: { clients: Client[]; expenses: Expense[]; onOpen: (tab: Tab) => void }) {
  const revenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = revenue - expenseTotal;
  const dialogs = clients.filter(client => isDialogStage(client.stage)).length;
  const calls = clients.filter(client => isCallStage(client.stage)).length;
  const sales = clients.filter(client => client.stage === "Оплачено").length;
  const averageCheck = sales ? Math.round(revenue / sales) : 0;
  const financeMetrics: OverviewMetric[] = [
    { label: "Выручка", value: formatMoney(revenue), progress: sales ? 100 : 0, progressLabel: "Оплаченных сделок", progressValue: String(sales), detail: "По оплатам в CRM", icon: CircleDollarSign, tone: "green" },
    { label: "Результат", value: formatMoney(profit), progress: Math.max(0, percent(profit, revenue)), progressLabel: "Маржинальность", progressValue: `${percent(profit, revenue)}%`, detail: "Выручка минус внесённые расходы", icon: TrendingUp, tone: "lime", featured: profit >= 0 },
    { label: "Расходы", value: formatMoney(expenseTotal), progress: percent(expenseTotal, Math.max(revenue, expenseTotal)), progressLabel: "Доля от оборота", progressValue: `${percent(expenseTotal, revenue)}%`, detail: `${expenses.length} сохранённых операций`, icon: Wallet, tone: "coral" },
  ];
  const salesMetrics: OverviewMetric[] = [
    { label: "Заявки", value: String(clients.length), progress: percent(dialogs, clients.length), progressLabel: "Дошли до диалога", progressValue: `${percent(dialogs, clients.length)}%`, detail: "Все заявки в CRM", icon: FileText, tone: "purple" },
    { label: "Звонки", value: String(calls), progress: percent(calls, dialogs), progressLabel: "Диалог → звонок", progressValue: `${percent(calls, dialogs)}%`, detail: "Заявки на этапе звонка и дальше", icon: Phone, tone: "blue" },
    { label: "Продажи", value: String(sales), progress: percent(sales, calls), progressLabel: "Звонок → продажа", progressValue: `${percent(sales, calls)}%`, detail: `Средний чек ${formatMoney(averageCheck)}`, icon: Target, tone: "yellow" },
  ];
  return <>
    <SectionHeading eyebrow="ГЛАВНОЕ ЗА ИЮЛЬ" title="Ключевые показатели" />
    <section className="overview-metric-section" aria-labelledby="finance-metrics-title">
      <div className="overview-group-head"><div><span>01</span><h3 id="finance-metrics-title">Финансы</h3></div><button onClick={() => onOpen("finance")}>Подробнее <ChevronRight size={15} /></button></div>
      <div className="overview-metric-grid">
        {financeMetrics.map(metric => <OverviewMetricCard key={metric.label} metric={metric} onClick={() => onOpen("finance")} />)}
      </div>
    </section>
    <section className="overview-metric-section" aria-labelledby="sales-metrics-title">
      <div className="overview-group-head"><div><span>02</span><h3 id="sales-metrics-title">Воронка продаж</h3></div><button onClick={() => onOpen("sales")}>Подробнее <ChevronRight size={15} /></button></div>
      <div className="overview-metric-grid">
        {salesMetrics.map(metric => <OverviewMetricCard key={metric.label} metric={metric} onClick={() => onOpen("sales")} />)}
      </div>
    </section>
  </>;
}

function Youtube({ clients, expenses, videoData, videoSource, exportReport }: { clients: Client[]; expenses: Expense[]; videoData: VideoData[]; videoSource: "demo" | "youtube"; exportReport: () => void }) {
  const fallbackVideos: VideoData[] = videos.map((video, index) => ({ id: index + 1, youtubeId: `demo-${index}`, title: video.title, publishedAt: `2026-07-${String(28 - index * 6).padStart(2, "0")}T10:00:00.000Z`, utm: ["yt_income_300", "yt_case_million", "yt_tools_growth", "yt_errors_5", "yt_choose_niche"][index], views: Number(video.views.replace(/[^\d,]/g, "").replace(",", ".")) * 1000, leads: video.leads, dialogs: Math.round(video.leads * .62), calls: video.calls, sales: video.sales, revenue: Number(video.revenue.replace(/[^\d,]/g, "").replace(",", ".")) * 1_000_000, spend: 0, updatedAt: "2026-08-05T08:00:00.000Z" }));
  const sourceRows = videoData.length ? videoData : fallbackVideos;
  const videoCards = sourceRows.map((video, index) => {
    const attributed = clients.filter(client => client.utm === video.utm);
    const useCrm = videoSource === "youtube" && attributed.length > 0;
    const linkedSpend = expenses.filter(expense => expense.videoId === video.title || expense.videoId === video.youtubeId).reduce((sum, expense) => sum + expense.amount, 0);
    return { ...video, leads: useCrm ? attributed.length : video.leads, dialogs: useCrm ? attributed.filter(client => isDialogStage(client.stage)).length : video.dialogs, calls: useCrm ? attributed.filter(client => isCallStage(client.stage)).length : video.calls, sales: useCrm ? attributed.filter(client => client.stage === "Оплачено").length : video.sales, revenue: useCrm ? attributed.reduce((sum, client) => sum + client.revenue, 0) : video.revenue, spend: linkedSpend || video.spend, accent: ["blue", "lime", "purple", "orange", "pink"][index % 5] };
  });
  const totals = videoCards.reduce((sum, video) => ({ views: sum.views + video.views, leads: sum.leads + video.leads, dialogs: sum.dialogs + video.dialogs, calls: sum.calls + video.calls, sales: sum.sales + video.sales, spend: sum.spend + video.spend }), { views: 0, leads: 0, dialogs: 0, calls: 0, sales: 0, spend: 0 });
  const monthlyMetrics = [
    { label: "Просмотры за месяц", value: formatCompact(totals.views), detail: videoSource === "youtube" ? "Из YouTube Data API" : "Демонстрационный снимок", icon: Video, tone: "purple" },
    { label: "Заявки с YouTube", value: formatCompact(totals.leads), detail: `${percent(totals.leads, totals.views)}% от просмотров`, icon: FileText, tone: "green" },
    { label: "Новые подписчики", value: "—", detail: "Нужен YouTube Analytics OAuth", icon: UsersRound, tone: "blue" },
    { label: "Входы во фронт", value: formatCompact(totals.dialogs), detail: `${percent(totals.dialogs, totals.leads)}% от заявок`, icon: Target, tone: "orange" },
    { label: "Выпущено роликов", value: String(videoCards.length), detail: "За выбранный месяц", icon: Play, tone: "lime" },
  ];
  const contentExpenses = [
    { label: "Продакшн", value: videoSource === "demo" ? 654000 : expenses.filter(item => item.category === "Продакшн").reduce((sum, item) => sum + item.amount, 0), tone: "purple" },
    { label: "Команда", value: videoSource === "demo" ? 412000 : expenses.filter(item => item.category === "Команда" && item.videoId).reduce((sum, item) => sum + item.amount, 0), tone: "blue" },
    { label: "Дизайн", value: videoSource === "demo" ? 278000 : expenses.filter(item => item.category === "Дизайн").reduce((sum, item) => sum + item.amount, 0), tone: "green" },
    { label: "Другое", value: videoSource === "demo" ? 186000 : expenses.filter(item => item.category === "YouTube").reduce((sum, item) => sum + item.amount, 0), tone: "gray" },
  ];
  return <>
    <SectionHeading eyebrow="ИТОГИ ЗА МЕСЯЦ" title="YouTube в цифрах" action={<div className="heading-actions"><span className={`data-source-chip ${videoSource}`}>{videoSource === "youtube" ? "YouTube подключён" : "Демо-данные"}</span><button className="secondary-button" onClick={exportReport}><Download size={16} /> Выгрузить отчёт</button></div>} />
    <section className="youtube-kpi-grid" aria-label="Ключевые показатели YouTube">
      {monthlyMetrics.map(metric => {
        const Icon = metric.icon;
        return <article className={`youtube-kpi-card ${metric.tone}`} key={metric.label}><div><span>{metric.label}</span><i><Icon size={18} /></i></div><strong>{metric.value}</strong><small>{metric.detail}</small></article>;
      })}
    </section>

    <section className="youtube-video-section" aria-labelledby="published-videos-title">
      <div className="overview-group-head"><div><span>01</span><h3 id="published-videos-title">Ролики за месяц</h3></div><small>Выпущено: <b>{videoCards.length}</b></small></div>
      <div className="youtube-video-grid">
        {videoCards.map((video, index) => <article className="youtube-video-card" key={video.youtubeId}>
          <div className={`youtube-video-cover ${video.accent}`}><span>{new Date(video.publishedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}</span><i><Play size={22} fill="currentColor" /></i><small>#{index + 1}</small></div>
          <div className="youtube-video-body"><h3>{video.title}</h3><div className="youtube-video-stats"><div><span>Просмотры</span><strong>{formatCompact(video.views)}</strong></div><div><span>Заявки</span><strong>{video.leads}</strong></div><div><span>Звонки</span><strong>{video.calls}</strong></div><div><span>Продажи</span><strong>{video.sales}</strong></div></div></div>
        </article>)}
      </div>
    </section>

    <section className="youtube-expense-section" aria-labelledby="youtube-expenses-title">
      <div className="overview-group-head"><div><span>02</span><h3 id="youtube-expenses-title">Расходы на контент</h3></div><small>Всего: <b>{formatMoney(contentExpenses.reduce((sum, item) => sum + item.value, 0))}</b></small></div>
      <div className="youtube-expense-grid">{contentExpenses.map(expense => <article className={`youtube-expense-card ${expense.tone}`} key={expense.label}><span>{expense.label}</span><strong>{formatMoney(expense.value)}</strong></article>)}</div>
    </section>
  </>;
}

function Sales({ clients, managers: team, onAddManager }: { clients: Client[]; managers: DbManager[]; onAddManager: () => void }) {
  const dialogs = clients.filter(client => isDialogStage(client.stage)).length;
  const calls = clients.filter(client => isCallStage(client.stage)).length;
  const sales = clients.filter(client => client.stage === "Оплачено").length;
  const answered = clients.filter(client => client.responseMinutes > 0);
  const averageResponse = answered.length ? Math.round(answered.reduce((sum, client) => sum + client.responseMinutes, 0) / answered.length) : 0;
  const withinSla = answered.filter(client => client.responseMinutes <= 7).length;
  const teamRows = team.length ? team.map((manager, index) => {
    const shortName = manager.name.split(" ")[0];
    const assigned = clients.filter(client => client.manager === shortName || client.manager === manager.name);
    const managerCalls = assigned.filter(client => isCallStage(client.stage)).length;
    const managerSales = assigned.filter(client => client.stage === "Оплачено").length;
    const managerRevenue = assigned.reduce((sum, client) => sum + client.revenue, 0);
    const responseRows = assigned.filter(client => client.responseMinutes > 0);
    return { name: manager.name, initials: manager.name.split(" ").map(part => part[0]).join(""), leads: assigned.length, calls: managerCalls, sales: managerSales, cr: `${percent(managerSales, managerCalls)}%`, response: responseRows.length ? `${Math.round(responseRows.reduce((sum, client) => sum + client.responseMinutes, 0) / responseRows.length)} мин` : "—", revenue: formatMoney(managerRevenue), plan: percent(managerRevenue, manager.plan), index };
  }) : managers.map((manager, index) => ({ ...manager, index }));
  return <>
    <SectionHeading eyebrow="ОТДЕЛ ПРОДАЖ" title="Ключевые показатели команды" action={<button className="primary-button" onClick={onAddManager}><Plus size={16} /> Добавить менеджера</button>} />
    <section className="metric-grid">
      <MetricCard label="Заявки" value={String(clients.length)} change={`${percent(dialogs, clients.length)}%`} hint="дошли до диалога" icon={FileText} />
      <MetricCard label="Звонки" value={String(calls)} change={`${percent(calls, dialogs)}%`} hint="из диалогов" icon={Phone} />
      <MetricCard label="Продажи" value={String(sales)} change={`${percent(sales, calls)}%`} hint="со звонка" icon={CircleDollarSign} />
      <MetricCard label="Средний первый ответ" value={averageResponse ? `${averageResponse} мин` : "—"} change={`${percent(withinSla, answered.length)}%`} hint="в рамках SLA до 7 минут" icon={Clock3} />
    </section>
    <section className="sales-grid">
      <article className="panel sales-funnel"><div className="panel-head"><div><span className="panel-kicker">ВОРОНКА ПРОДАЖ</span><h3>Конверсия по этапам</h3></div><span className="neutral-chip">CRM</span></div>
        <div className="sales-stage-list">
          {[{l:"Заявки",v:clients.length,p:"100%"},{l:"Диалог",v:dialogs,p:`${percent(dialogs, clients.length)}%`},{l:"Звонок",v:calls,p:`${percent(calls, dialogs)}%`},{l:"Оплачено",v:sales,p:`${percent(sales, calls)}%`}].map((item, i, rows) => <div className={i === rows.length - 1 ? "paid" : ""} key={item.l}><span className="stage-number">{String(i + 1).padStart(2,"0")}</span><span>{item.l}</span><strong>{item.v}</strong><em>{item.p}</em></div>)}
        </div>
      </article>
      <article className="panel response-panel"><div className="panel-head"><div><span className="panel-kicker">СКОРОСТЬ ОТВЕТА</span><h3>По заявкам в CRM</h3></div><span className="goal-chip">Цель &lt; 7 мин</span></div><div className="response-simple-grid"><div className="response-main"><span><Zap size={20} /></span><small>Средний первый ответ</small><strong>{averageResponse ? `${averageResponse} мин` : "—"}</strong><em>{answered.length} заявок с замером</em></div><div><small>В рамках SLA</small><strong>{percent(withinSla, answered.length)}%</strong><em>{withinSla} ответов вовремя</em></div><div><small>Просрочено</small><strong>{percent(answered.length - withinSla, answered.length)}%</strong><em>{answered.length - withinSla} требуют разбора</em></div></div></article>
    </section>
    <article className="panel manager-panel"><div className="panel-head"><div><span className="panel-kicker">КОМАНДА</span><h3>Результаты менеджеров</h3></div></div><div className="table-scroll"><table className="data-table manager-table"><thead><tr><th>Менеджер</th><th>Заявки</th><th>Звонки</th><th>Продажи</th><th>Конверсия</th><th>Средний ответ</th><th>Выручка</th><th>План</th></tr></thead><tbody>{teamRows.map((m)=><tr key={m.name}><td><div className="manager-name"><span className={`manager-avatar c${m.index % 4}`}>{m.initials}</span><div><strong>{m.name}</strong><small>{team.length ? "Добавлен в команду" : "Демо-профиль"}</small></div></div></td><td>{m.leads}</td><td>{m.calls}</td><td><strong>{m.sales}</strong></td><td><span className="conversion">{m.cr}</span></td><td>{m.response}</td><td><strong>{m.revenue}</strong></td><td><div className="plan-cell"><span><i style={{width:`${Math.min(m.plan,100)}%`}} /></span><b>{m.plan}%</b></div></td></tr>)}</tbody></table></div></article>
  </>;
}

function CRM({ clients, allClients, search, setSearch, filter, setFilter, openClient, onNewLead, onImport, onExport }: { clients: Client[]; allClients: Client[]; search: string; setSearch: (v: string) => void; filter: string; setFilter: (v: string) => void; openClient: (c: Client) => void; onNewLead: () => void; onImport: () => void; onExport: () => void }) {
  const stages = [
    { label: "Новые", value: allClients.filter(client => client.stage === "Новая").length, filter: "Новая", color: "blue" },
    { label: "В диалоге", value: allClients.filter(client => client.stage === "Диалог").length, filter: "Диалог", color: "purple" },
    { label: "На звонке", value: allClients.filter(client => client.stage === "Звонок").length, filter: "Звонок", color: "orange" },
    { label: "Думают", value: allClients.filter(client => client.stage === "Думает").length, filter: "Думает", color: "yellow" },
    { label: "Оплачено", value: allClients.filter(client => client.stage === "Оплачено").length, filter: "Оплачено", color: "green" },
    { label: "Не целевые", value: allClients.filter(client => client.stage === "Не целевой").length, filter: "Не целевой", color: "gray" },
  ];
  const summarize = (field: "ageGroup" | "incomeBand") => Object.entries(allClients.reduce<Record<string, number>>((acc, client) => { const key = client[field] || "Не указан"; acc[key] = (acc[key] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]);
  return <>
    <SectionHeading eyebrow="ЕДИНАЯ БАЗА" title="CRM — все заявки" action={<div className="heading-actions"><button className="secondary-button" onClick={onImport}><Upload size={16} /> Импорт CSV</button><button className="primary-button" onClick={onNewLead}><Plus size={16} /> Новая заявка</button></div>} />
    <section className="crm-pipeline">{stages.map(stage=><button key={stage.label} onClick={() => setFilter(stage.filter)}><i className={stage.color} /><span>{stage.label}</span><strong>{stage.value}</strong><ChevronRight size={15} /></button>)}</section>
    <section className="crm-segments" aria-label="Аналитика заявок"><article><span>Возраст заявок</span><div>{summarize("ageGroup").map(([label, value]) => <p key={label}><b>{label}</b><strong>{value}</strong><small>{percent(value, allClients.length)}%</small></p>)}</div></article><article><span>Доход заявок</span><div>{summarize("incomeBand").map(([label, value]) => <p key={label}><b>{label}</b><strong>{value}</strong><small>{percent(value, allClients.length)}%</small></p>)}</div></article></section>
    <article className="panel crm-table-panel">
      <div className="crm-toolbar"><label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Найти клиента, контакт или UTM..." /></label><div><label className="filter-select"><Filter size={15} /><select value={filter} onChange={e => setFilter(e.target.value)}><option>Все статусы</option><option>Новая</option><option>Диалог</option><option>Звонок</option><option>Думает</option><option>Оплачено</option><option>Не целевой</option></select><ChevronDown size={13} /></label><button className="secondary-button" onClick={onExport}><Download size={15} /> Экспорт</button></div></div>
      <div className="table-scroll"><table className="data-table crm-table"><thead><tr><th>Клиент</th><th>Статус</th><th>Источник / UTM</th><th>Доход</th><th>Менеджер</th><th>Последняя активность</th><th /></tr></thead><tbody>{clients.map((client,i)=><tr key={client.id} onClick={() => openClient(client)}><td><div className="manager-name"><span className={`client-avatar c${i%4}`}>{client.name.split(" ").map(n=>n[0]).join("")}</span><div><strong>{client.name}</strong><small>{client.contact} · {client.ageGroup}</small></div></div></td><td><Status value={client.stage} /></td><td><div className="source-cell"><strong><Play size={12} fill="currentColor" /> {client.source}</strong><small>{client.utm}</small></div></td><td><span>{client.incomeBand}</span></td><td>{client.manager}</td><td><div className="activity-cell"><strong>{client.lastActivity}</strong><small>{client.responseMinutes ? `Первый ответ: ${client.responseMinutes} мин` : "Ждёт ответа"}</small></div></td><td><button className="row-arrow"><ChevronRight size={17} /></button></td></tr>)}</tbody></table>{clients.length === 0 && <div className="empty-state"><Search size={22} /><strong>Ничего не найдено</strong><p>Попробуйте изменить запрос или фильтр.</p></div>}</div>
    </article>
  </>;
}

function Finance({ clients, expenses, onAddExpense }: { clients: Client[]; expenses: Expense[]; onAddExpense: () => void }) {
  const revenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = revenue - expenseTotal;
  const groupedExpenses = Object.entries(expenses.reduce<Record<string, number>>((acc, expense) => { acc[expense.category] = (acc[expense.category] || 0) + expense.amount; return acc; }, {})).sort((a, b) => b[1] - a[1]);
  const groupedRevenue = Object.entries(clients.reduce<Record<string, number>>((acc, client) => { if (client.revenue > 0) acc[client.source] = (acc[client.source] || 0) + client.revenue; return acc; }, {})).sort((a, b) => b[1] - a[1]);
  return <>
    <SectionHeading eyebrow="P&L" title="Доходы, расходы и результат" action={<button className="primary-button" onClick={onAddExpense}><Plus size={16} /> Внести расход</button>} />
    <section className="finance-hero">
      <article className={`profit-card ${profit < 0 ? "negative" : ""}`}><span>РЕЗУЛЬТАТ ПО СОХРАНЁННЫМ ДАННЫМ</span><strong>{formatMoney(profit)}</strong><div><p>Выручка минус внесённые расходы</p></div><div className="profit-keylines"><span>Маржинальность <b>{percent(profit, revenue)}%</b></span><span>Операций <b>{expenses.length}</b></span></div></article>
      <article className="panel finance-breakdown"><div className="finance-line"><span><i className="green-dot" />Доходы из CRM</span><strong>{formatMoney(revenue)}</strong><span className="neutral-chip">{clients.filter(client => client.revenue > 0).length} оплат</span></div><div className="finance-line"><span><i className="red-dot" />Внесённые расходы</span><strong>{formatMoney(expenseTotal)}</strong><span className="neutral-chip">{expenses.length} операций</span></div><div className="finance-margin"><span>Расходы / выручка</span><strong>{percent(expenseTotal, revenue)}%</strong><div><i style={{width:`${Math.min(percent(expenseTotal, revenue), 100)}%`}} /></div></div></article>
    </section>
    <section className="finance-grid">
      <article className="panel expense-chart"><div className="panel-head"><div><span className="panel-kicker">РАСХОДЫ ПО СТАТЬЯМ</span><h3>{formatMoney(expenseTotal)}</h3></div></div><div className="expense-list expense-list-wide">{groupedExpenses.map(([category, amount], index)=><div key={category}><span><i className={["violet","blue","cyan","orange","gray"][index % 5]} />{category}</span><strong>{formatMoney(amount)}</strong><em>{percent(amount, expenseTotal)}%</em></div>)}{!groupedExpenses.length && <div className="empty-state compact"><Wallet size={20}/><strong>Расходов нет</strong></div>}</div></article>
      <article className="panel income-products"><div className="panel-head"><div><span className="panel-kicker">ВЫРУЧКА ПО ИСТОЧНИКАМ</span><h3>{formatMoney(revenue)}</h3></div></div>{groupedRevenue.map(([source, amount], index)=><div className="product-income" key={source}><div><span>{source}</span><strong>{formatMoney(amount)}</strong></div><p><i className={`p${index % 3}`} style={{width:`${percent(amount, revenue)}%`}} /></p><em>{percent(amount, revenue)}%</em></div>)}{!groupedRevenue.length && <div className="empty-state compact"><CircleDollarSign size={20}/><strong>Оплат пока нет</strong></div>}</article>
    </section>
    <article className="panel transactions"><div className="panel-head"><div><span className="panel-kicker">ПОСЛЕДНИЕ ОПЕРАЦИИ</span><h3>Сохранённые расходы</h3></div><button className="text-button" onClick={onAddExpense}>Добавить <Plus size={15}/></button></div>{expenses.slice(0,6).map((expense)=><div className="transaction" key={expense.id}><span className="outcome"><ArrowUpRight size={17}/></span><div><strong>{expense.description}</strong><small>{expense.category} · {expense.spentAt}</small></div><b className="minus">−{formatMoney(expense.amount)}</b></div>)}{!expenses.length && <div className="empty-state compact"><Wallet size={20}/><strong>Расходов пока нет</strong><p>Добавьте первую операцию.</p></div>}</article>
  </>;
}

function Product({ data, onEdit }: { data: ProductData | null; onEdit: () => void }) {
  const metrics = data ?? { id: 0, period: "2026-08", activeStudents: 428, casesCount: 63, nps: 74, completionRate: 87, atRisk: 34, avgResultDays: 38 };
  return <>
    <SectionHeading eyebrow="ПРОДУКТ" title="Ключевые метрики" action={<button className="secondary-button" onClick={onEdit}><Settings size={16} /> Обновить метрики</button>} />
    <section className="product-hero-grid simple-product-hero">
      <article className="panel product-summary-card"><div className="panel-head"><span className="panel-kicker">NPS · ТЕКУЩИЙ ПЕРИОД</span></div><strong>{metrics.nps}</strong><p>Оценка лояльности учеников</p></article>
      <article className="panel product-summary-card"><div className="panel-head"><span className="panel-kicker">АКТИВНЫЕ УЧЕНИКИ</span></div><strong>{metrics.activeStudents}</strong><p>Сейчас проходят программу</p></article>
      <article className="panel case-card"><div className="case-icon"><Sparkles size={21}/></div><span>КЕЙСЫ ЗА ПЕРИОД</span><strong>{metrics.casesCount}</strong><p>Подтверждённые результаты учеников</p><button onClick={onEdit}>Обновить данные <ChevronRight size={15}/></button></article>
    </section>
    <section className="product-metrics-grid"><article className="panel"><span className="panel-kicker">ДОХОДИМОСТЬ</span><div className="big-row"><strong>{metrics.completionRate}%</strong></div><p>Прошли больше 70% программы</p><div className="progress thick"><i style={{width:`${metrics.completionRate}%`}} /></div></article><article className="panel"><span className="panel-kicker">СРЕДНЕЕ ВРЕМЯ ДО РЕЗУЛЬТАТА</span><div className="big-row"><strong>{metrics.avgResultDays} дней</strong></div><p>От старта до первого подтверждённого кейса</p></article><article className="panel"><span className="panel-kicker">В ЗОНЕ РИСКА</span><div className="big-row"><strong>{metrics.atRisk} учеников</strong><span className="warning-chip">{Math.round(metrics.atRisk / Math.max(metrics.activeStudents,1)*100)}%</span></div><p>Нет активности более 7 дней</p></article></section>
  </>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button className={`toggle ${checked ? "on" : ""}`} onClick={onChange} role="switch" aria-checked={checked}><i /></button>;
}

function Automations({ reportEnabled, setReportEnabled, nudgeEnabled, setNudgeEnabled, syncEnabled, setSyncEnabled, reminders, activityEvents, integrationStatus, openSettings, runAutomation }: { reportEnabled: boolean; setReportEnabled: (v:boolean)=>void; nudgeEnabled:boolean; setNudgeEnabled:(v:boolean)=>void; syncEnabled:boolean; setSyncEnabled:(v:boolean)=>void; reminders: Reminder[]; activityEvents: ActivityEvent[]; integrationStatus: IntegrationStatus; openSettings: () => void; runAutomation: (action: "process_due" | "daily_report") => Promise<void> }) {
  const planned = reminders.filter(reminder => reminder.status === "planned").length;
  const sent = reminders.filter(reminder => reminder.status === "sent").length;
  return <>
    <SectionHeading eyebrow="TELEGRAM + CRM" title="Автоматизации" action={<button className="primary-button" onClick={openSettings}><Settings size={16}/> Центр подключений</button>} />
    <section className={`integration-status ${integrationStatus.telegram.configured ? "" : "needs-setup"}`}><div className="telegram-mark"><Bot size={25}/></div><div><span>TELEGRAM WORKSPACE</span><strong>{integrationStatus.telegram.configured ? `${integrationStatus.telegram.botName || "Telegram-бот"} подключён` : "Готов к подключению"}</strong><p>{integrationStatus.telegram.configured ? "Ключи проверены · можно отправлять отчёты" : "Добавьте токен бота и ID чата — сценарии уже подготовлены"}</p></div><span className={integrationStatus.telegram.configured ? "connected" : "setup-required"}><i/>{integrationStatus.telegram.configured ? "Система работает" : "Нужны доступы"}</span><button onClick={openSettings}><Settings size={16}/> Настроить</button></section>
    <section className="automation-grid">
      <article className="panel automation-card featured"><div className="automation-top"><span className="automation-icon"><FileText size={19}/></span><Toggle checked={syncEnabled} onChange={()=>setSyncEnabled(!syncEnabled)}/></div><span className="panel-kicker">ВХОДЯЩИЕ ЗАЯВКИ</span><h3>Webhook → CRM</h3><p>Создаёт карточку клиента, переносит анкету, UTM и ролик, назначает наименее загруженного менеджера.</p><div className="automation-flow"><span>Форма / бот</span><ChevronRight size={15}/><span>Webhook</span><ChevronRight size={15}/><span>CRM</span></div><footer><span><Activity size={14}/> {integrationStatus.webhook.configured ? "Защищён и готов" : "Нужен секрет webhook"}</span><button onClick={openSettings}><ChevronRight size={16}/></button></footer></article>
      <article className="panel automation-card"><div className="automation-top"><span className="automation-icon orange"><Bell size={19}/></span><Toggle checked={nudgeEnabled} onChange={()=>setNudgeEnabled(!nudgeEnabled)}/></div><span className="panel-kicker">ДОЖИМ ЛИДОВ</span><h3>Напоминания менеджерам</h3><p>Сохраняет задачу и тегает ответственного в общем Telegram-чате при запуске обработчика.</p><div className="rule-line"><span>Ожидают отправки</span><strong>{planned}</strong></div><div className="rule-line"><span>Уже отправлено</span><strong>{sent}</strong></div><footer><span><Bell size={14}/> Проверка доступна сейчас</span><button onClick={() => runAutomation("process_due")} aria-label="Проверить напоминания"><RefreshCw size={15}/></button></footer></article>
      <article className="panel automation-card"><div className="automation-top"><span className="automation-icon green"><BarChart3 size={19}/></span><Toggle checked={reportEnabled} onChange={()=>setReportEnabled(!reportEnabled)}/></div><span className="panel-kicker">ЕЖЕДНЕВНАЯ СВОДКА</span><h3>Отчёт руководителю</h3><p>Собирает заявки, звонки, продажи, выручку и конверсии в одном Telegram-сообщении.</p><div className="rule-line"><span>Плановое время</span><strong>20:30 · НСК</strong></div><div className="rule-line"><span>Автозапуск</span><strong>нужен внешний cron</strong></div><footer><span><Clock3 size={14}/> {integrationStatus.telegram.configured ? "Можно отправить сейчас" : "Ожидает ключ Telegram"}</span><button onClick={() => runAutomation("daily_report")} aria-label="Отправить отчёт сейчас"><Send size={15}/></button></footer></article>
    </section>
    <section className="bot-preview-grid">
      <article className="panel bot-preview"><div className="panel-head"><div><span className="panel-kicker">ПРЕДПРОСМОТР</span><h3>Ежедневный отчёт</h3></div><span className="telegram-chip">Telegram</span></div><div className="phone-message"><div className="message-head"><span className="brand-mark"><Sparkles size={14}/></span><div><strong>LUMO · Итоги дня</strong><small>5 августа · 20:30</small></div></div><p>Команда, итоги на сегодня 👇</p><div className="message-metrics"><span><b>59</b> заявок</span><span><b>18</b> звонков</span><span><b>6</b> продаж</span></div><div className="message-revenue"><span>Выручка за день</span><strong>814 000 ₽</strong></div><p>Конверсии:<br/>Заявка → звонок: <b>30,5%</b><br/>Звонок → продажа: <b>33,3%</b><br/>Заявка → продажа: <b>10,2%</b></p><div className="message-footer"><span>План дня выполнен на 112% 🔥</span><small>20:30</small></div></div></article>
      <article className="panel activity-log"><div className="panel-head"><div><span className="panel-kicker">ЖУРНАЛ</span><h3>Последние срабатывания</h3></div></div>{activityEvents.slice(0, 8).map((event, index)=><div className="log-row" key={event.id}><span className={["blue","orange","purple","green"][index % 4]}><Check size={14}/></span><div><strong>{event.title}</strong><small>{event.detail || event.type}</small></div><time>{new Date(event.createdAt).toLocaleString("ru-RU", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" })}</time></div>)}{!activityEvents.length && <div className="empty-state compact"><Activity size={20}/><strong>Срабатываний пока нет</strong><p>Они появятся после импорта, webhook или напоминания.</p></div>}</article>
    </section>
  </>;
}

function ClientDrawer({ client, close, updateClient, openReminder, deleteClient, setToast }: { client: Client; close: () => void; updateClient: (id:number, patch:Partial<Client>)=>void; openReminder:()=>void; deleteClient: (id: number) => void; setToast: (value: string) => void }) {
  const [notes, setNotes] = useState(client.notes || "");
  const [revenue, setRevenue] = useState(client.revenue || 0);
  const openTelegram = () => window.open(`https://t.me/${client.contact.replace("@","")}`, "_blank", "noopener,noreferrer");
  return <><button className="drawer-backdrop" onClick={close} aria-label="Закрыть карточку"/><aside className="client-drawer">
    <header><div><span className="client-big-avatar">{client.name.split(" ").map(n=>n[0]).join("")}</span><div><h2>{client.name}</h2><a href={`https://t.me/${client.contact.replace("@","")}`}>{client.contact}<ExternalLink size={12}/></a></div></div><button onClick={close}><X size={20}/></button></header>
    <div className="drawer-actions"><button className="primary-button" onClick={openTelegram}><MessageCircle size={16}/> Написать</button><button className="secondary-button" onClick={() => { updateClient(client.id, { stage: "Звонок", callOutcome: "Назначен" }); setToast("Звонок отмечен в карточке"); }}><Phone size={16}/> Звонок</button><button className="secondary-button" onClick={openReminder}><Bell size={16}/></button></div>
    <section className="drawer-section"><span className="panel-kicker">ЭТАП СДЕЛКИ</span><label className="drawer-select"><select value={client.stage} onChange={e=>updateClient(client.id,{stage:e.target.value})}><option>Новая</option><option>Диалог</option><option>Звонок</option><option>Думает</option><option>Оплачено</option><option>Не целевой</option></select><ChevronDown size={15}/></label><div className="stage-track"><i/><i/><i className={client.stage!=="Новая"?"done":""}/><i className={["Звонок","Думает","Оплачено"].includes(client.stage)?"done":""}/><i className={client.stage==="Оплачено"?"done":""}/></div></section>
    <section className="drawer-section"><span className="panel-kicker">ОТВЕТСТВЕННЫЙ</span><div className="responsible"><span className="manager-avatar c0">МС</span><label><select value={client.manager} onChange={e=>updateClient(client.id,{manager:e.target.value})}><option>Не назначен</option><option>Мария</option><option>Алексей</option><option>Денис</option><option>Ольга</option></select><ChevronDown size={14}/></label><small>{client.manager === "Не назначен" ? "Назначьте менеджера" : "В сети"}</small></div></section>
    <section className="drawer-section"><span className="panel-kicker">АНКЕТА КЛИЕНТА</span><div className="details-grid"><div><span>Возраст</span><strong>{client.ageGroup}</strong></div><div><span>Доход</span><strong>{client.incomeBand}</strong></div><div><span>Источник</span><strong>{client.source}</strong></div><div><span>Первый ответ</span><strong>{client.responseMinutes ? `${client.responseMinutes} мин` : "—"}</strong></div></div></section>
    <section className="drawer-section"><span className="panel-kicker">ОПЛАТА И ВЫРУЧКА</span><div className="payment-editor"><label><span>Сумма сделки</span><input type="number" min="0" value={revenue} onChange={e => setRevenue(Number(e.target.value))} /></label><button className="secondary-button" onClick={() => updateClient(client.id, { revenue })}><Save size={14}/> Сохранить</button><button className="primary-button" onClick={() => updateClient(client.id, { revenue, stage: "Оплачено" })}><CreditCard size={14}/> Оплачено</button></div></section>
    <section className="drawer-section"><span className="panel-kicker">АТРИБУЦИЯ</span><div className="source-card"><span className="video-thumb blue"><Play size={14} fill="currentColor"/></span><div><strong>{client.video}</strong><small>utm_campaign: {client.utm}</small></div><ChevronRight size={16}/></div></section>
    <section className="drawer-section"><div className="drawer-section-head"><span className="panel-kicker">ЗАМЕТКИ МЕНЕДЖЕРА</span><button onClick={() => updateClient(client.id, { notes })}>Сохранить</button></div><textarea className="client-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Контекст диалога, возражения, договорённости..." rows={4}/></section>
    <section className="drawer-section"><div className="drawer-section-head"><span className="panel-kicker">ИСТОРИЯ</span><button onClick={openReminder}>Добавить задачу</button></div><div className="timeline">{client.nextFollowUp && <div><i className="green"/><span>{new Date(client.nextFollowUp).toLocaleString("ru-RU")}</span><strong>Запланирован дожим</strong><p>Менеджер: {client.manager}</p></div>}{client.saleAt && <div><i className="green"/><span>{new Date(client.saleAt).toLocaleString("ru-RU")}</span><strong>Сделка оплачена</strong><p>{formatMoney(client.revenue)}</p></div>}{client.callAt && <div><i className="blue"/><span>{new Date(client.callAt).toLocaleString("ru-RU")}</span><strong>Заявка перешла на звонок</strong><p>{client.callOutcome || "Результат не указан"}</p></div>}{client.responseMinutes > 0 && <div><i className="blue"/><span>Первый контакт</span><strong>Менеджер ответил</strong><p>Время ответа: {client.responseMinutes} мин</p></div>}<div><i/><span>{client.createdAt}</span><strong>Заявка создана из {client.source}</strong><p>utm_campaign: {client.utm}</p></div></div></section>
    <button className="reminder-wide" onClick={openReminder}><Bell size={16}/> Поставить напоминание о дожиме</button>
    <button className="delete-wide" onClick={() => { if (window.confirm("Удалить заявку без возможности восстановления?")) deleteClient(client.id); }}><Trash2 size={15}/> Удалить заявку</button>
  </aside></>;
}

function ReminderModal({ client, close, done }: { client: Client; close:()=>void; done:()=>void }) {
  const [date, setDate] = useState(() => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
  const [message, setMessage] = useState(`Написать ${client.name.split(" ")[0]} и уточнить решение по программе`);
  const [error, setError] = useState("");
  const submit = async (e:FormEvent) => { e.preventDefault(); setError(""); const response = await fetch("/api/reminders", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:client.id,manager:client.manager,message,remindAt:date})}); const data = await response.json().catch(()=>({})); if (!response.ok) { setError(data.error || "Не удалось сохранить напоминание"); return; } done(); };
  return <div className="modal-wrap"><button className="modal-backdrop" onClick={close}/><form className="reminder-modal" onSubmit={submit}><header><div><span className="automation-icon orange"><Bell size={18}/></span><div><span>НАПОМИНАНИЕ</span><h3>Дожим лида</h3></div></div><button type="button" onClick={close}><X size={19}/></button></header><p>Задача сохранится в CRM. После подключения Telegram обработчик отметит менеджера в общем чате.</p><label>Клиент<input value={client.name} disabled/></label><label>Ответственный<select value={client.manager} disabled><option>{client.manager}</option></select></label><label>Дата и время<input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required/></label><label>Сообщение<textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3}/></label>{error && <p className="form-error">{error}</p>}<div><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" type="submit">Создать напоминание</button></div></form></div>;
}

function ModalShell({ icon: Icon, kicker, title, copy, close, children, wide = false }: { icon: LucideIcon; kicker: string; title: string; copy: string; close: () => void; children: React.ReactNode; wide?: boolean }) {
  return <div className="modal-wrap"><button className="modal-backdrop" onClick={close} aria-label="Закрыть окно"/><section className={`action-modal ${wide ? "wide" : ""}`}><header><div><span className="automation-icon"><Icon size={18}/></span><div><span>{kicker}</span><h3>{title}</h3></div></div><button type="button" onClick={close}><X size={19}/></button></header><p className="modal-copy">{copy}</p>{children}</section></div>;
}

function NewLeadModal({ close, done, managers }: { close: () => void; done: (rows: Client[]) => void; managers: DbManager[] }) {
  const [form, setForm] = useState({ name: "", contact: "", ageGroup: "25–34", incomeBand: "150–250 тыс. ₽", source: "YouTube", video: videos[0].title, utm: "", manager: "Не назначен", notes: "" });
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError("");
    const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Не удалось сохранить заявку"); return; }
    done(data.clients);
  };
  return <ModalShell icon={UserRound} kicker="CRM" title="Новая заявка" copy="Создайте клиента вручную — карточка попадёт в общую воронку и аналитику." close={close} wide><form className="action-form form-grid" onSubmit={submit}>
    <label>Имя и фамилия<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Например, Анна Волкова"/></label>
    <label>Telegram или телефон<input required value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="@username или +7..."/></label>
    <label>Возраст<select value={form.ageGroup} onChange={e=>setForm({...form,ageGroup:e.target.value})}><option>до 18</option><option>18–24</option><option>25–34</option><option>35–44</option><option>45+</option><option>Не указан</option></select></label>
    <label>Доход<select value={form.incomeBand} onChange={e=>setForm({...form,incomeBand:e.target.value})}><option>до 80 тыс. ₽</option><option>80–150 тыс. ₽</option><option>150–250 тыс. ₽</option><option>250+ тыс. ₽</option><option>Не указан</option></select></label>
    <label className="span-2">Ролик-источник<select value={form.video} onChange={e=>setForm({...form,video:e.target.value})}>{videos.map(video=><option key={video.title}>{video.title}</option>)}<option>Без атрибуции</option></select></label>
    <label>UTM campaign<input value={form.utm} onChange={e=>setForm({...form,utm:e.target.value})} placeholder="yt_income_300"/></label>
    <label>Менеджер<select value={form.manager} onChange={e=>setForm({...form,manager:e.target.value})}><option>Не назначен</option>{managers.map(manager=><option key={manager.id}>{manager.name.split(" ")[0]}</option>)}</select></label>
    <label className="span-2">Комментарий<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} placeholder="Что важно знать менеджеру"/></label>
    {error && <p className="form-error span-2">{error}</p>}
    <div className="form-actions span-2"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button type="submit" className="primary-button"><Save size={15}/> Сохранить заявку</button></div>
  </form></ModalShell>;
}

function ExpenseModal({ close, done }: { close: () => void; done: (expense: Expense) => void }) {
  const [form, setForm] = useState({ category: "YouTube", description: "", amount: 0, spentAt: "2026-08-05", videoId: "" });
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(""); const response = await fetch("/api/expenses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json().catch(() => ({})); if (!response.ok) { setError(data.error || "Не удалось сохранить расход"); return; } done(data.expense); };
  return <ModalShell icon={Wallet} kicker="ФИНАНСЫ" title="Внести расход" copy="Операция сохранится в базе и появится в ленте P&L." close={close}><form className="action-form" onSubmit={submit}>
    <label>Статья<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>YouTube</option><option>Команда</option><option>Маркетинг</option><option>Сервисы</option><option>Налоги</option><option>Прочее</option></select></label>
    <label>Описание<input required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Например, монтаж ролика"/></label>
    <label>Сумма, ₽<input required type="number" min="1" value={form.amount || ""} onChange={e=>setForm({...form,amount:Number(e.target.value)})}/></label>
    <label>Дата<input required type="date" value={form.spentAt} onChange={e=>setForm({...form,spentAt:e.target.value})}/></label>
    {form.category === "YouTube" && <label>Привязать к ролику<select value={form.videoId} onChange={e=>setForm({...form,videoId:e.target.value})}><option value="">Общие расходы канала</option>{videos.map(video=><option key={video.title} value={video.title}>{video.title}</option>)}</select></label>}
    {error && <p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" type="submit"><Save size={15}/> Добавить расход</button></div>
  </form></ModalShell>;
}

function ManagerModal({ close, done }: { close: () => void; done: (manager: DbManager) => void }) {
  const [form, setForm] = useState({ name: "", telegram: "", email: "", plan: 3500000 });
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const response = await fetch("/api/managers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await response.json().catch(() => ({})); if (!response.ok) { setError(data.error || "Не удалось добавить менеджера"); return; } done(data.manager); };
  return <ModalShell icon={UsersRound} kicker="КОМАНДА" title="Добавить менеджера" copy="После добавления менеджера можно назначать ответственным в CRM и Telegram-сценариях." close={close}><form className="action-form" onSubmit={submit}><label>Имя и фамилия<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Telegram<input required value={form.telegram} onChange={e=>setForm({...form,telegram:e.target.value})} placeholder="@manager"/></label><label>Рабочая почта<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>План выручки, ₽<input type="number" min="0" value={form.plan} onChange={e=>setForm({...form,plan:Number(e.target.value)})}/></label>{error && <p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" type="submit">Добавить в команду</button></div></form></ModalShell>;
}

function parseCsv(text: string): Array<Record<string, string>> {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes(";") ? ";" : lines[0].includes("\t") ? "\t" : ",";
  const clean = (value: string) => value.trim().replace(/^"|"$/g, "");
  const headers = lines[0].split(delimiter).map(value => clean(value).toLowerCase());
  const aliases: Record<string,string> = { "имя":"name", "фио":"name", "name":"name", "контакт":"contact", "telegram":"contact", "телефон":"contact", "contact":"contact", "возраст":"ageGroup", "age":"ageGroup", "доход":"incomeBand", "income":"incomeBand", "ролик":"video", "video":"video", "utm":"utm", "utm_campaign":"utm", "статус":"stage", "status":"stage", "менеджер":"manager", "manager":"manager", "комментарий":"notes", "notes":"notes" };
  return lines.slice(1).map(line => Object.fromEntries(line.split(delimiter).map((value,index)=>[aliases[headers[index]] || headers[index],clean(value)])));
}

function ImportModal({ close, done }: { close: () => void; done: (rows: Client[]) => void }) {
  const [csv, setCsv] = useState("name;contact;age;income;video;utm;status;manager\nИван Петров;@ivan;25–34;150–250 тыс. ₽;Как выйти на доход 300к в 2026;yt_income_300;Новая;Мария");
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const rows = parseCsv(csv); if (!rows.length) { setError("Не удалось распознать строки. Нужна строка заголовков и минимум один лид."); return; } const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clients: rows }) }); const data = await response.json().catch(() => ({})); if (!response.ok) { setError(data.error || "Ошибка импорта"); return; } done(data.clients); };
  const readFile = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => setCsv(String(reader.result || "")); reader.readAsText(file); };
  return <ModalShell icon={Upload} kicker="МАССОВОЕ ДОБАВЛЕНИЕ" title="Импорт заявок из CSV" copy="Поддерживаются русские и английские заголовки. До 500 строк за загрузку." close={close} wide><form className="action-form" onSubmit={submit}><label className="file-drop"><Upload size={18}/><span>Выберите CSV-файл</span><input type="file" accept=".csv,.txt" onChange={e=>readFile(e.target.files?.[0])}/></label><label>Данные CSV<textarea className="csv-area" rows={9} value={csv} onChange={e=>setCsv(e.target.value)}/></label><p className="form-help">Поля: name/имя, contact/контакт, age/возраст, income/доход, video/ролик, utm, status/статус, manager/менеджер.</p>{error && <p className="form-error">{error}</p>}<div className="form-actions"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button type="submit" className="primary-button"><Database size={15}/> Импортировать</button></div></form></ModalShell>;
}

function IntegrationModal({ status, close, setToast, runIntegration }: { status: IntegrationStatus; close: () => void; setToast: (value:string)=>void; runIntegration: (kind:"telegram"|"youtube")=>Promise<void> }) {
  const copyWebhook = async () => { await navigator.clipboard.writeText(status.webhook.url); setToast("Webhook URL скопирован"); };
  return <ModalShell icon={Zap} kicker="ИНТЕГРАЦИИ" title="Центр подключений" copy="Код готов. Ниже — точный статус внешних доступов, без имитации подключения." close={close} wide><div className="connection-list">
    <article><span className="connection-icon telegram"><Bot size={19}/></span><div><strong>Telegram Bot API</strong><p>Заявки, напоминания и ежедневный отчёт</p><small>{status.telegram.configured ? "Ключи добавлены" : `Нужно добавить: ${status.telegram.missing.join(", ") || "токен и chat ID"}`}</small></div><span className={status.telegram.configured ? "connection-ok" : "connection-wait"}>{status.telegram.configured ? "Подключено" : "Ожидает"}</span><button className="secondary-button" onClick={()=>runIntegration("telegram")}><Send size={14}/> Тест</button></article>
    <article><span className="connection-icon youtube"><Play size={19} fill="currentColor"/></span><div><strong>YouTube Data API</strong><p>Ролики, просмотры и автоматическое обновление</p><small>{status.youtube.configured ? "Ключи добавлены" : `Нужно добавить: ${status.youtube.missing.join(", ") || "API key и channel ID"}`}</small></div><span className={status.youtube.configured ? "connection-ok" : "connection-wait"}>{status.youtube.configured ? "Подключено" : "Ожидает"}</span><button className="secondary-button" onClick={()=>runIntegration("youtube")}><RefreshCw size={14}/> Синхр.</button></article>
    <article><span className="connection-icon webhook"><Database size={19}/></span><div><strong>Webhook заявок</strong><p>Для Telegram-бота, Tilda, формы или Make</p><code>{status.webhook.url}</code><small>{status.webhook.configured ? "Защищён секретом и принимает заявки" : "Добавьте LEAD_WEBHOOK_SECRET, чтобы активировать endpoint"}</small></div><span className={status.webhook.configured ? "connection-ok" : "connection-wait"}>{status.webhook.configured ? "Защищён" : "Отключён"}</span><button className="secondary-button" onClick={copyWebhook}><Copy size={14}/> Копировать</button></article>
  </div><div className="connection-note"><Settings size={16}/><p><strong>Почему ключи не вводятся здесь?</strong><span>Токены — секреты. Они добавляются в защищённые переменные среды, а не сохраняются в браузере или базе CRM.</span></p></div></ModalShell>;
}

function ProductModal({ data, close, done }: { data: ProductData; close: () => void; done: (product: ProductData) => void }) {
  const [form, setForm] = useState(data);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const response = await fetch("/api/product", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const result = await response.json().catch(() => ({})); if (!response.ok) { setError(result.error || "Не удалось обновить метрики"); return; } done(result.product); };
  const field = (key: keyof ProductData, label: string, min=0, max?: number) => <label>{label}<input type="number" min={min} max={max} value={Number(form[key])} onChange={e=>setForm({...form,[key]:Number(e.target.value)})}/></label>;
  return <ModalShell icon={PackageCheck} kicker="ПРОДУКТ" title="Обновить ключевые метрики" copy="Значения сохранятся и обновят продуктовый дашборд." close={close} wide><form className="action-form form-grid" onSubmit={submit}>{field("activeStudents","Активные ученики")}{field("casesCount","Кейсы за период")}{field("nps","NPS",-100,100)}{field("completionRate","Доходимость, %",0,100)}{field("atRisk","В зоне риска")}{field("avgResultDays","Среднее время до результата, дней")}{error && <p className="form-error span-2">{error}</p>}<div className="form-actions span-2"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" type="submit"><Save size={15}/> Сохранить</button></div></form></ModalShell>;
}
