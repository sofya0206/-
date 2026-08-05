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

  const updateClient = (id: number, patch: Partial<Client>) => {
    setClients(prev => prev.map(client => client.id === id ? { ...client, ...patch, lastActivity: "Только что" } : client));
    setActiveClient(prev => prev?.id === id ? { ...prev, ...patch, lastActivity: "Только что" } : prev);
    fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) }).catch(() => undefined);
    setToast("Карточка клиента обновлена");
  };

  const persistToggle = (key: string, enabled: boolean) => {
    fetch("/api/automation-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, enabled }) }).catch(() => undefined);
  };

  const addClients = (rows: Client[]) => { setClients(prev => [...rows, ...prev]); setToast(rows.length > 1 ? `Импортировано заявок: ${rows.length}` : "Новая заявка добавлена"); };
  const addExpense = (expense: Expense) => { setExpenses(prev => [expense, ...prev]); setToast("Расход сохранён и учтён в P&L"); };
  const addManager = (manager: DbManager) => { setDbManagers(prev => [...prev, manager]); setToast("Менеджер добавлен в команду"); };
  const saveProduct = (product: ProductData) => { setProductData(product); setToast("Метрики продукта обновлены"); };
  const deleteClient = async (id: number) => { await fetch(`/api/leads?id=${id}`, { method: "DELETE" }).catch(() => undefined); setClients(prev => prev.filter(client => client.id !== id)); setActiveClient(null); setToast("Заявка удалена"); };

  const runIntegration = async (kind: "telegram" | "youtube") => {
    const endpoint = kind === "telegram" ? "/api/integrations/telegram" : "/api/integrations/youtube";
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: kind === "telegram" ? JSON.stringify({ action: "daily_report" }) : undefined });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setToast(data.error === "Telegram не настроен" || data.error === "YouTube не настроен" ? "Сначала добавьте ключи в настройках подключения" : (data.error || "Не удалось выполнить операцию")); return; }
    setToast(kind === "telegram" ? "Отчёт отправлен в Telegram" : `YouTube синхронизирован: ${data.synced} роликов`);
  };

  const exportReport = () => {
    const rows = [["Ролик", "Просмотры", "Заявки", "Звонки", "Продажи", "Выручка"], ...videos.map(v => [v.title, v.views, v.leads, v.calls, v.sales, v.revenue])];
    const blob = new Blob([rows.map(r => r.join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "lumo-youtube-report.csv"; a.click(); URL.revokeObjectURL(url);
    setToast("Отчёт выгружен в CSV");
  };

  const title = nav.find(item => item.id === activeTab)?.label ?? "Обзор";

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><strong>LUMO</strong><small>analytics</small></div>
      <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню"><X size={20} /></button>
      <nav>
        <span className="nav-label">РАБОЧЕЕ ПРОСТРАНСТВО</span>
        {nav.slice(0, 6).map(item => <button key={item.id} className={activeTab === item.id ? "active" : ""} onClick={() => changeTab(item.id)}><item.icon size={18} /><span>{item.label}</span>{item.id === "crm" && <b>12</b>}</button>)}
        <span className="nav-label nav-label-second">СИСТЕМА</span>
        {nav.slice(6).map(item => <button key={item.id} className={activeTab === item.id ? "active" : ""} onClick={() => changeTab(item.id)}><item.icon size={18} /><span>{item.label}</span><em /></button>)}
        <button><Settings size={18} /><span>Настройки</span></button>
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
        {activeTab === "overview" && <Overview onOpen={changeTab} />}
        {activeTab === "youtube" && <Youtube exportReport={exportReport} />}
        {activeTab === "sales" && <Sales managersCount={dbManagers.length} onAddManager={() => setManagerOpen(true)} />}
        {activeTab === "crm" && <CRM clients={filteredClients} search={search} setSearch={setSearch} filter={stageFilter} setFilter={setStageFilter} openClient={setActiveClient} onNewLead={() => setNewLeadOpen(true)} onImport={() => setImportOpen(true)} />}
        {activeTab === "finance" && <Finance expenses={expenses} onAddExpense={() => setExpenseOpen(true)} />}
        {activeTab === "product" && <Product data={productData} onEdit={() => setProductOpen(true)} />}
        {activeTab === "automations" && <Automations reportEnabled={reportEnabled} setReportEnabled={(value) => { setReportEnabled(value); persistToggle("daily_report", value); }} nudgeEnabled={nudgeEnabled} setNudgeEnabled={(value) => { setNudgeEnabled(value); persistToggle("lead_nudges", value); }} syncEnabled={syncEnabled} setSyncEnabled={(value) => { setSyncEnabled(value); persistToggle("lead_sync", value); }} setToast={setToast} integrationStatus={integrationStatus} openSettings={() => setIntegrationOpen(true)} runIntegration={runIntegration} />}
      </div>
    </main>

    {activeClient && <ClientDrawer client={activeClient} close={() => setActiveClient(null)} updateClient={updateClient} openReminder={() => setReminderOpen(true)} deleteClient={deleteClient} setToast={setToast} />}
    {reminderOpen && activeClient && <ReminderModal client={activeClient} close={() => setReminderOpen(false)} done={() => { setReminderOpen(false); setToast("Напоминание создано — бот напишет менеджеру"); }} />}
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
  change: string;
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
      <span className="overview-metric-change"><ArrowUpRight size={14} />{metric.change}</span>
      <span className="overview-metric-icon"><Icon size={19} /></span>
    </span>
    <strong>{metric.value}</strong>
    <span className="overview-metric-detail">{metric.detail}</span>
    <span className="overview-progress-copy"><span>{metric.progressLabel}</span><b>{metric.progressValue}</b></span>
    <span className="overview-progress" aria-hidden="true"><i style={{ width: `${Math.min(metric.progress, 100)}%` }} /></span>
  </button>;
}

function Overview({ onOpen }: { onOpen: (tab: Tab) => void }) {
  const financeMetrics: OverviewMetric[] = [
    { label: "Выручка", value: "18,42 млн ₽", change: "+18,2%", progress: 100, progressLabel: "Выполнение плана", progressValue: "108%", detail: "Все поступления за июль", icon: CircleDollarSign, tone: "green" },
    { label: "Чистая прибыль", value: "7,86 млн ₽", change: "+24,7%", progress: 42.7, progressLabel: "Маржинальность", progressValue: "42,7%", detail: "После всех расходов", icon: TrendingUp, tone: "lime", featured: true },
    { label: "Расходы", value: "6,18 млн ₽", change: "−4,8%", progress: 95.2, progressLabel: "Бюджет использован", progressValue: "95,2%", detail: "Ниже плана на 312 тыс. ₽", icon: Wallet, tone: "coral" },
  ];
  const salesMetrics: OverviewMetric[] = [
    { label: "Заявки", value: "1 836", change: "+11,8%", progress: 59.5, progressLabel: "Дошли до диалога", progressValue: "59,5%", detail: "Из всех источников", icon: FileText, tone: "purple" },
    { label: "Звонки", value: "486", change: "+13,4%", progress: 44.5, progressLabel: "Диалог → звонок", progressValue: "44,5%", detail: "Проведено отделом продаж", icon: Phone, tone: "blue" },
    { label: "Продажи", value: "137", change: "+15,1%", progress: 28.2, progressLabel: "Звонок → продажа", progressValue: "28,2%", detail: "Средний чек 134 450 ₽", icon: Target, tone: "yellow" },
  ];
  return <>
    <SectionHeading eyebrow="ГЛАВНОЕ ЗА ИЮЛЬ" title="Ключевые показатели" copy="Шесть цифр, по которым видно состояние бизнеса. Подробности — внутри разделов." />
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

function Youtube({ exportReport }: { exportReport: () => void }) {
  const monthlyMetrics = [
    { label: "Просмотры за месяц", value: "1,24 млн", detail: "+14,6% к июню", icon: Video, tone: "purple" },
    { label: "Заявки с YouTube", value: "1 836", detail: "1,48% от просмотров", icon: FileText, tone: "green" },
    { label: "Новые подписчики", value: "+18 420", detail: "+2,3% к базе канала", icon: UsersRound, tone: "blue" },
    { label: "Входы во фронт", value: "742", detail: "40,4% от заявок", icon: Target, tone: "orange" },
    { label: "Выпущено роликов", value: "5", detail: "За выбранный месяц", icon: Play, tone: "lime" },
  ];
  const contentExpenses = [
    { label: "Продакшн", value: "654 тыс. ₽", tone: "purple" },
    { label: "Команда", value: "412 тыс. ₽", tone: "blue" },
    { label: "Дизайн", value: "278 тыс. ₽", tone: "green" },
    { label: "Другое", value: "186 тыс. ₽", tone: "gray" },
  ];
  return <>
    <SectionHeading eyebrow="ИТОГИ ЗА МЕСЯЦ" title="YouTube в цифрах" copy="Только просмотры, заявки, подписчики, входы во фронт и выпущенные ролики." action={<button className="secondary-button" onClick={exportReport}><Download size={16} /> Выгрузить отчёт</button>} />
    <section className="youtube-kpi-grid" aria-label="Ключевые показатели YouTube">
      {monthlyMetrics.map(metric => {
        const Icon = metric.icon;
        return <article className={`youtube-kpi-card ${metric.tone}`} key={metric.label}><div><span>{metric.label}</span><i><Icon size={18} /></i></div><strong>{metric.value}</strong><small>{metric.detail}</small></article>;
      })}
    </section>

    <section className="youtube-video-section" aria-labelledby="published-videos-title">
      <div className="overview-group-head"><div><span>01</span><h3 id="published-videos-title">Ролики за месяц</h3></div><small>Выпущено: <b>{videos.length}</b></small></div>
      <div className="youtube-video-grid">
        {videos.map((video, index) => <article className="youtube-video-card" key={video.title}>
          <div className={`youtube-video-cover ${video.accent}`}><span>{video.date}</span><i><Play size={22} fill="currentColor" /></i><small>#{index + 1}</small></div>
          <div className="youtube-video-body"><h3>{video.title}</h3><div className="youtube-video-stats"><div><span>Просмотры</span><strong>{video.views}</strong></div><div><span>Заявки</span><strong>{video.leads}</strong></div><div><span>Звонки</span><strong>{video.calls}</strong></div><div><span>Продажи</span><strong>{video.sales}</strong></div></div></div>
        </article>)}
      </div>
    </section>

    <section className="youtube-expense-section" aria-labelledby="youtube-expenses-title">
      <div className="overview-group-head"><div><span>02</span><h3 id="youtube-expenses-title">Расходы на контент</h3></div><small>Всего: <b>1,53 млн ₽</b></small></div>
      <div className="youtube-expense-grid">{contentExpenses.map(expense => <article className={`youtube-expense-card ${expense.tone}`} key={expense.label}><span>{expense.label}</span><strong>{expense.value}</strong></article>)}</div>
    </section>
  </>;
}

function Sales({ managersCount, onAddManager }: { managersCount: number; onAddManager: () => void }) {
  return <>
    <SectionHeading eyebrow="ОТДЕЛ ПРОДАЖ" title="Команда выполняет план на 94%" copy={`В реальном времени: ${managersCount || 4} менеджера, нагрузка, скорость ответа, звонки, конверсии и выручка.`} action={<button className="primary-button" onClick={onAddManager}><Plus size={16} /> Добавить менеджера</button>} />
    <section className="metric-grid">
      <MetricCard label="Новые заявки" value="1 836" change="11,8%" hint="59 в день" icon={FileText} />
      <MetricCard label="Проведено звонков" value="486" change="8,4%" hint="15,7 в день" icon={Phone} />
      <MetricCard label="Продаж" value="137" change="15,1%" hint="28,2% со звонка" icon={CircleDollarSign} />
      <MetricCard label="Средний первый ответ" value="5:48" change="1:12" hint="цель до 7 минут" icon={Clock3} />
    </section>
    <section className="sales-grid">
      <article className="panel sales-funnel"><div className="panel-head"><div><span className="panel-kicker">ВОРОНКА ПРОДАЖ</span><h3>Конверсия по этапам</h3></div><span className="live-chip"><i /> LIVE</span></div>
        <div className="sales-stage-list">
          {[{l:"Новые заявки",v:"1 836",p:"100%"},{l:"Вступили в диалог",v:"1 092",p:"59,5%"},{l:"Квалифицированы",v:"742",p:"67,9%"},{l:"Назначен звонок",v:"536",p:"72,2%"},{l:"Звонок проведён",v:"486",p:"90,7%"},{l:"Оплачено",v:"137",p:"28,2%"}].map((item, i) => <div className={i === 5 ? "paid" : ""} key={item.l}><span className="stage-number">{String(i + 1).padStart(2,"0")}</span><span>{item.l}</span><strong>{item.v}</strong><em>{item.p}</em></div>)}
        </div>
      </article>
      <article className="panel response-panel"><div className="panel-head"><div><span className="panel-kicker">СКОРОСТЬ ОТВЕТА</span><h3>Сегодня</h3></div><span className="goal-chip">Цель &lt; 7 мин</span></div><div className="response-simple-grid"><div className="response-main"><span><Zap size={20} /></span><small>Средний первый ответ</small><strong>4:36</strong><em>На 18% быстрее</em></div><div><small>В рамках SLA</small><strong>86%</strong><em>Ответили вовремя</em></div><div><small>Просрочено</small><strong>14%</strong><em>Нужно разобрать</em></div></div></article>
    </section>
    <article className="panel manager-panel"><div className="panel-head"><div><span className="panel-kicker">КОМАНДА</span><h3>Результаты менеджеров</h3></div><button className="text-button">Настроить план <ChevronRight size={15} /></button></div><div className="table-scroll"><table className="data-table manager-table"><thead><tr><th>Менеджер</th><th>Заявки</th><th>Звонки</th><th>Продажи</th><th>Конверсия</th><th>Средний ответ</th><th>Выручка</th><th>План</th></tr></thead><tbody>{managers.map((m,i)=><tr key={m.name}><td><div className="manager-name"><span className={`manager-avatar c${i}`}>{m.initials}</span><div><strong>{m.name}</strong><small>{i < 3 ? "В сети" : "Был(а) 18 мин назад"}</small></div></div></td><td>{m.leads}</td><td>{m.calls}</td><td><strong>{m.sales}</strong></td><td><span className="conversion">{m.cr}</span></td><td>{m.response}</td><td><strong>{m.revenue}</strong></td><td><div className="plan-cell"><span><i style={{width:`${Math.min(m.plan,100)}%`}} /></span><b>{m.plan}%</b></div></td></tr>)}</tbody></table></div></article>
  </>;
}

function CRM({ clients, search, setSearch, filter, setFilter, openClient, onNewLead, onImport }: { clients: Client[]; search: string; setSearch: (v: string) => void; filter: string; setFilter: (v: string) => void; openClient: (c: Client) => void; onNewLead: () => void; onImport: () => void }) {
  return <>
    <SectionHeading eyebrow="ЕДИНАЯ БАЗА" title="CRM — все заявки" copy="Лид появляется автоматически из Telegram-бота вместе с анкетой, UTM и роликом-источником." action={<div className="heading-actions"><button className="secondary-button" onClick={onImport}><Upload size={16} /> Импорт CSV</button><button className="primary-button" onClick={onNewLead}><Plus size={16} /> Новая заявка</button></div>} />
    <section className="crm-pipeline">{[{l:"Новые",v:42,c:"blue"},{l:"В диалоге",v:68,c:"purple"},{l:"Квалифицированы",v:51,c:"cyan"},{l:"Звонок",v:34,c:"orange"},{l:"Думают",v:19,c:"yellow"},{l:"Оплачено",v:27,c:"green"}].map(s=><button key={s.l} onClick={() => setFilter(s.l === "Новые" ? "Новая" : s.l === "В диалоге" ? "Диалог" : s.l === "Оплачено" ? "Оплачено" : "Все статусы")}><i className={s.c} /><span>{s.l}</span><strong>{s.v}</strong><ChevronRight size={15} /></button>)}</section>
    <article className="panel crm-table-panel">
      <div className="crm-toolbar"><label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Найти клиента, контакт или UTM..." /></label><div><label className="filter-select"><Filter size={15} /><select value={filter} onChange={e => setFilter(e.target.value)}><option>Все статусы</option><option>Новая</option><option>Диалог</option><option>Звонок</option><option>Думает</option><option>Оплачено</option><option>Не целевой</option></select><ChevronDown size={13} /></label><button className="secondary-button"><Download size={15} /> Экспорт</button></div></div>
      <div className="table-scroll"><table className="data-table crm-table"><thead><tr><th>Клиент</th><th>Статус</th><th>Источник / UTM</th><th>Доход</th><th>Менеджер</th><th>Последняя активность</th><th /></tr></thead><tbody>{clients.map((client,i)=><tr key={client.id} onClick={() => openClient(client)}><td><div className="manager-name"><span className={`client-avatar c${i%4}`}>{client.name.split(" ").map(n=>n[0]).join("")}</span><div><strong>{client.name}</strong><small>{client.contact} · {client.ageGroup}</small></div></div></td><td><Status value={client.stage} /></td><td><div className="source-cell"><strong><Play size={12} fill="currentColor" /> {client.source}</strong><small>{client.utm}</small></div></td><td><span>{client.incomeBand}</span></td><td>{client.manager}</td><td><div className="activity-cell"><strong>{client.lastActivity}</strong><small>{client.responseMinutes ? `Первый ответ: ${client.responseMinutes} мин` : "Ждёт ответа"}</small></div></td><td><button className="row-arrow"><ChevronRight size={17} /></button></td></tr>)}</tbody></table>{clients.length === 0 && <div className="empty-state"><Search size={22} /><strong>Ничего не найдено</strong><p>Попробуйте изменить запрос или фильтр.</p></div>}</div>
    </article>
  </>;
}

function Finance({ expenses, onAddExpense }: { expenses: Expense[]; onAddExpense: () => void }) {
  const savedTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return <>
    <SectionHeading eyebrow="P&L В РЕАЛЬНОМ ВРЕМЕНИ" title="Финансы без ручных таблиц" copy={`Сохранено операций: ${expenses.length}. Внесено расходов: ${formatMoney(savedTotal)}.`} action={<button className="primary-button" onClick={onAddExpense}><Plus size={16} /> Внести расход</button>} />
    <section className="finance-hero">
      <article className="profit-card"><span>ЧИСТАЯ ПРИБЫЛЬ · ИЮЛЬ</span><strong>7 862 400 ₽</strong><div><Trend value="24,7%" /><p>+1,56 млн ₽ к июню</p></div><div className="profit-keylines"><span>Маржинальность <b>42,7%</b></span><span>План выполнен <b>108%</b></span></div></article>
      <article className="panel finance-breakdown"><div className="finance-line"><span><i className="green-dot" />Доходы</span><strong>18 420 600 ₽</strong><Trend value="18,2%" /></div><div className="finance-line"><span><i className="red-dot" />Расходы</span><strong>6 184 200 ₽</strong><Trend value="4,8%" positive={false} /></div><div className="finance-line"><span><i className="gray-dot" />Налоги и резервы</span><strong>4 374 000 ₽</strong><span className="neutral-chip">23,7%</span></div><div className="finance-margin"><span>Маржинальность</span><strong>42,7%</strong><div><i style={{width:"42.7%"}} /></div></div></article>
    </section>
    <section className="finance-grid">
      <article className="panel expense-chart"><div className="panel-head"><div><span className="panel-kicker">СТРУКТУРА РАСХОДОВ</span><h3>6,18 млн ₽</h3></div><button className="ghost-icon"><MoreHorizontal size={18}/></button></div><div className="expense-list expense-list-wide">{[["Команда","2,04 млн ₽","33%","violet"],["Маркетинг","1,62 млн ₽","26%","blue"],["YouTube","1,53 млн ₽","25%","cyan"],["Сервисы","582 тыс. ₽","9%","orange"],["Прочее","412 тыс. ₽","7%","gray"]].map(x=><div key={x[0]}><span><i className={x[3]} />{x[0]}</span><strong>{x[1]}</strong><em>{x[2]}</em></div>)}</div></article>
      <article className="panel income-products"><div className="panel-head"><div><span className="panel-kicker">ДОХОД ПО ПРОДУКТАМ</span><h3>Структура выручки</h3></div></div>{[["Основная программа","14,86 млн ₽",81],["VIP-сопровождение","2,38 млн ₽",13],["Интенсив","1,18 млн ₽",6]].map((x,i)=><div className="product-income" key={x[0]}><div><span>{x[0]}</span><strong>{x[1]}</strong></div><p><i className={`p${i}`} style={{width:`${x[2]}%`}} /></p><em>{x[2]}%</em></div>)}<div className="income-note"><Sparkles size={16}/><p><strong>Основная программа растёт</strong><span>+23% к прошлому месяцу</span></p></div></article>
    </section>
    <article className="panel transactions"><div className="panel-head"><div><span className="panel-kicker">ПОСЛЕДНИЕ ОПЕРАЦИИ</span><h3>Сохранённые расходы</h3></div><button className="text-button" onClick={onAddExpense}>Добавить <Plus size={15}/></button></div>{expenses.slice(0,6).map((expense)=><div className="transaction" key={expense.id}><span className="outcome"><ArrowUpRight size={17}/></span><div><strong>{expense.description}</strong><small>{expense.category} · {expense.spentAt}</small></div><b className="minus">−{formatMoney(expense.amount)}</b></div>)}{!expenses.length && <div className="empty-state compact"><Wallet size={20}/><strong>Расходов пока нет</strong><p>Добавьте первую операцию.</p></div>}</article>
  </>;
}

function Product({ data, onEdit }: { data: ProductData | null; onEdit: () => void }) {
  const metrics = data ?? { id: 0, period: "2026-08", activeStudents: 428, casesCount: 63, nps: 74, completionRate: 87, atRisk: 34, avgResultDays: 38 };
  return <>
    <SectionHeading eyebrow="ЗДОРОВЬЕ ПРОДУКТА" title="Ученики получают результат" copy="Динамика обучения, кейсы, NPS и сигналы риска — в одном продуктном контуре." action={<button className="secondary-button" onClick={onEdit}><Settings size={16} /> Обновить метрики</button>} />
    <section className="product-hero-grid simple-product-hero">
      <article className="panel product-summary-card"><div className="panel-head"><span className="panel-kicker">NPS · ТЕКУЩИЙ ПЕРИОД</span><Trend value="6 пунктов" /></div><strong>{metrics.nps}</strong><p>81% учеников — промоутеры продукта</p></article>
      <article className="panel product-summary-card"><div className="panel-head"><span className="panel-kicker">АКТИВНЫЕ УЧЕНИКИ</span><Trend value="12,4%" /></div><strong>{metrics.activeStudents}</strong><p>Доходимость программы — {metrics.completionRate}%</p></article>
      <article className="panel case-card"><div className="case-icon"><Sparkles size={21}/></div><span>КЕЙСЫ ЗА ПЕРИОД</span><strong>{metrics.casesCount}</strong><p>Подтверждённые результаты учеников</p><button onClick={onEdit}>Обновить данные <ChevronRight size={15}/></button></article>
    </section>
    <section className="product-metrics-grid"><article className="panel"><span className="panel-kicker">ДОХОДИМОСТЬ</span><div className="big-row"><strong>{metrics.completionRate}%</strong><Trend value="4,2%" /></div><p>Прошли больше 70% программы</p><div className="progress thick"><i style={{width:`${metrics.completionRate}%`}} /></div></article><article className="panel"><span className="panel-kicker">СРЕДНЕЕ ВРЕМЯ ДО РЕЗУЛЬТАТА</span><div className="big-row"><strong>{(metrics.avgResultDays/7).toFixed(1).replace(".",",")} недели</strong><Trend value="0,8 нед." /></div><p>От старта до первого подтверждённого кейса</p></article><article className="panel"><span className="panel-kicker">В ЗОНЕ РИСКА</span><div className="big-row"><strong>{metrics.atRisk} ученика</strong><span className="warning-chip">{Math.round(metrics.atRisk / Math.max(metrics.activeStudents,1)*100)}%</span></div><p>Нет активности более 7 дней</p><button className="outline-warning" onClick={onEdit}>Обновить список <ChevronRight size={15}/></button></article></section>
    <article className="panel modules-panel"><div className="panel-head"><div><span className="panel-kicker">ПРОГРАММА</span><h3>Прохождение по модулям</h3></div><button className="text-button">Когорты <ChevronDown size={14}/></button></div>{[["01","Фундамент и стратегия",96,411],["02","Позиционирование",91,389],["03","Продуктовая матрица",84,359],["04","Контент и трафик",76,325],["05","Продажи и система",68,291],["06","Масштабирование",54,231]].map(x=><div className="module-row" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><div><i style={{width:`${x[2]}%`}} /></div><b>{x[2]}%</b><small>{x[3]} учеников</small></div>)}</article>
  </>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button className={`toggle ${checked ? "on" : ""}`} onClick={onChange} role="switch" aria-checked={checked}><i /></button>;
}

function Automations({ reportEnabled, setReportEnabled, nudgeEnabled, setNudgeEnabled, syncEnabled, setSyncEnabled, setToast, integrationStatus, openSettings, runIntegration }: { reportEnabled: boolean; setReportEnabled: (v:boolean)=>void; nudgeEnabled:boolean; setNudgeEnabled:(v:boolean)=>void; syncEnabled:boolean; setSyncEnabled:(v:boolean)=>void; setToast:(v:string)=>void; integrationStatus: IntegrationStatus; openSettings: () => void; runIntegration: (kind: "telegram" | "youtube") => Promise<void> }) {
  return <>
    <SectionHeading eyebrow="TELEGRAM + CRM" title="Автоматизации, которые не дают терять лидов" copy="Бот собирает заявки, напоминает менеджерам о дожиме и отправляет руководителю ежедневный отчёт." action={<button className="primary-button" onClick={openSettings}><Settings size={16}/> Центр подключений</button>} />
    <section className={`integration-status ${integrationStatus.telegram.configured ? "" : "needs-setup"}`}><div className="telegram-mark"><Bot size={25}/></div><div><span>TELEGRAM WORKSPACE</span><strong>{integrationStatus.telegram.configured ? `${integrationStatus.telegram.botName || "Telegram-бот"} подключён` : "Готов к подключению"}</strong><p>{integrationStatus.telegram.configured ? "Ключи проверены · можно отправлять отчёты" : "Добавьте токен бота и ID чата — сценарии уже подготовлены"}</p></div><span className={integrationStatus.telegram.configured ? "connected" : "setup-required"}><i/>{integrationStatus.telegram.configured ? "Система работает" : "Нужны доступы"}</span><button onClick={openSettings}><Settings size={16}/> Настроить</button></section>
    <section className="automation-grid">
      <article className="panel automation-card featured"><div className="automation-top"><span className="automation-icon"><FileText size={19}/></span><Toggle checked={syncEnabled} onChange={()=>setSyncEnabled(!syncEnabled)}/></div><span className="panel-kicker">ВХОДЯЩИЕ ЗАЯВКИ</span><h3>Telegram → CRM</h3><p>Создаёт карточку клиента, переносит анкету, UTM и ролик, назначает свободного менеджера.</p><div className="automation-flow"><span>Telegram</span><ChevronRight size={15}/><span>Квалификация</span><ChevronRight size={15}/><span>CRM</span></div><footer><span><Activity size={14}/> Сегодня обработано: <b>59</b></span><button><ChevronRight size={16}/></button></footer></article>
      <article className="panel automation-card"><div className="automation-top"><span className="automation-icon orange"><Bell size={19}/></span><Toggle checked={nudgeEnabled} onChange={()=>setNudgeEnabled(!nudgeEnabled)}/></div><span className="panel-kicker">ДОЖИМ ЛИДОВ</span><h3>Напоминания менеджерам</h3><p>Тегает ответственного в Telegram в нужное время и повторно напоминает, если задача не закрыта.</p><div className="rule-line"><span>Если нет ответа</span><strong>через 15 мин</strong></div><div className="rule-line"><span>Повторная эскалация</span><strong>через 30 мин</strong></div><footer><span><Bell size={14}/> Сегодня отправлено: <b>17</b></span><button><ChevronRight size={16}/></button></footer></article>
      <article className="panel automation-card"><div className="automation-top"><span className="automation-icon green"><BarChart3 size={19}/></span><Toggle checked={reportEnabled} onChange={()=>setReportEnabled(!reportEnabled)}/></div><span className="panel-kicker">ЕЖЕДНЕВНАЯ СВОДКА</span><h3>Отчёт руководителю</h3><p>Каждый день собирает ключевые метрики команды и присылает их одним сообщением.</p><div className="rule-line"><span>Время отправки</span><strong>20:30 · НСК</strong></div><div className="rule-line"><span>Telegram</span><strong>{integrationStatus.telegram.configured ? "Подключён" : "Ожидает ключ"}</strong></div><footer><span><Clock3 size={14}/> Следующий: <b>сегодня</b></span><button onClick={() => runIntegration("telegram")} aria-label="Отправить отчёт сейчас"><Send size={15}/></button></footer></article>
    </section>
    <section className="bot-preview-grid">
      <article className="panel bot-preview"><div className="panel-head"><div><span className="panel-kicker">ПРЕДПРОСМОТР</span><h3>Ежедневный отчёт</h3></div><span className="telegram-chip">Telegram</span></div><div className="phone-message"><div className="message-head"><span className="brand-mark"><Sparkles size={14}/></span><div><strong>LUMO · Итоги дня</strong><small>5 августа · 20:30</small></div></div><p>Команда, итоги на сегодня 👇</p><div className="message-metrics"><span><b>59</b> заявок</span><span><b>18</b> звонков</span><span><b>6</b> продаж</span></div><div className="message-revenue"><span>Выручка за день</span><strong>814 000 ₽</strong></div><p>Конверсии:<br/>Заявка → звонок: <b>30,5%</b><br/>Звонок → продажа: <b>33,3%</b><br/>Заявка → продажа: <b>10,2%</b></p><div className="message-footer"><span>План дня выполнен на 112% 🔥</span><small>20:30</small></div></div></article>
      <article className="panel activity-log"><div className="panel-head"><div><span className="panel-kicker">ЖУРНАЛ</span><h3>Последние срабатывания</h3></div><button className="text-button">Весь журнал <ChevronRight size={15}/></button></div>{[["Заявка создана в CRM","Анна Волкова · yt_income_300","2 мин назад","blue"],["Менеджер получил напоминание","@maria_sales · Максим Соколов","12 мин назад","orange"],["Лид назначен автоматически","Илья Козлов → Алексей Белов","26 мин назад","purple"],["Эскалация руководителю","Лид #1842 без ответа 31 мин","48 мин назад","red"],["Данные звонка синхронизированы","Дарья Смирнова · 18:42 мин","1 ч назад","green"]].map(x=><div className="log-row" key={x[0]}><span className={x[3]}><Check size={14}/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div><time>{x[2]}</time></div>)}</article>
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
    <section className="drawer-section"><span className="panel-kicker">АНКЕТА КЛИЕНТА</span><div className="details-grid"><div><span>Возраст</span><strong>{client.ageGroup}</strong></div><div><span>Доход</span><strong>{client.incomeBand}</strong></div><div><span>Источник</span><strong>YouTube</strong></div><div><span>Первый ответ</span><strong>{client.responseMinutes ? `${client.responseMinutes} мин` : "—"}</strong></div></div></section>
    <section className="drawer-section"><span className="panel-kicker">ОПЛАТА И ВЫРУЧКА</span><div className="payment-editor"><label><span>Сумма сделки</span><input type="number" min="0" value={revenue} onChange={e => setRevenue(Number(e.target.value))} /></label><button className="secondary-button" onClick={() => updateClient(client.id, { revenue })}><Save size={14}/> Сохранить</button><button className="primary-button" onClick={() => updateClient(client.id, { revenue, stage: "Оплачено" })}><CreditCard size={14}/> Оплачено</button></div></section>
    <section className="drawer-section"><span className="panel-kicker">АТРИБУЦИЯ</span><div className="source-card"><span className="video-thumb blue"><Play size={14} fill="currentColor"/></span><div><strong>{client.video}</strong><small>utm_campaign: {client.utm}</small></div><ChevronRight size={16}/></div></section>
    <section className="drawer-section"><div className="drawer-section-head"><span className="panel-kicker">ЗАМЕТКИ МЕНЕДЖЕРА</span><button onClick={() => updateClient(client.id, { notes })}>Сохранить</button></div><textarea className="client-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Контекст диалога, возражения, договорённости..." rows={4}/></section>
    <section className="drawer-section"><div className="drawer-section-head"><span className="panel-kicker">ИСТОРИЯ</span><button onClick={openReminder}>Добавить задачу</button></div><div className="timeline"><div><i className="green"/><span>Сегодня, 11:26</span><strong>Назначен звонок на 14:30</strong><p>Менеджер: {client.manager}</p></div><div><i className="blue"/><span>Сегодня, 10:46</span><strong>Первое сообщение менеджера</strong><p>Время ответа: {client.responseMinutes || 4} минуты</p></div><div><i/><span>{client.createdAt}</span><strong>Заявка создана из {client.source}</strong><p>UTM и анкета добавлены автоматически</p></div></div></section>
    <button className="reminder-wide" onClick={openReminder}><Bell size={16}/> Поставить напоминание о дожиме</button>
    <button className="delete-wide" onClick={() => { if (window.confirm("Удалить заявку без возможности восстановления?")) deleteClient(client.id); }}><Trash2 size={15}/> Удалить заявку</button>
  </aside></>;
}

function ReminderModal({ client, close, done }: { client: Client; close:()=>void; done:()=>void }) {
  const [date, setDate] = useState("2026-08-05T16:30");
  const [message, setMessage] = useState(`Написать ${client.name.split(" ")[0]} и уточнить решение по программе`);
  const submit = (e:FormEvent) => { e.preventDefault(); fetch("/api/reminders", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:client.id,manager:client.manager,message,remindAt:date})}).catch(()=>undefined); done(); };
  return <div className="modal-wrap"><button className="modal-backdrop" onClick={close}/><form className="reminder-modal" onSubmit={submit}><header><div><span className="automation-icon orange"><Bell size={18}/></span><div><span>НАПОМИНАНИЕ</span><h3>Дожим лида</h3></div></div><button type="button" onClick={close}><X size={19}/></button></header><p>Бот отправит сообщение менеджеру в Telegram и добавит задачу в карточку.</p><label>Клиент<input value={client.name} disabled/></label><label>Ответственный<select value={client.manager} disabled><option>{client.manager}</option></select></label><label>Дата и время<input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required/></label><label>Сообщение<textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3}/></label><div><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" type="submit">Создать напоминание</button></div></form></div>;
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
    <article><span className="connection-icon webhook"><Database size={19}/></span><div><strong>Webhook заявок</strong><p>Для Telegram-бота, Tilda, формы или Make</p><code>{status.webhook.url}</code><small>{status.webhook.configured ? "Защищён секретом" : "Endpoint работает; перед запуском добавьте LEAD_WEBHOOK_SECRET"}</small></div><span className={status.webhook.configured ? "connection-ok" : "connection-wait"}>{status.webhook.configured ? "Защищён" : "Без секрета"}</span><button className="secondary-button" onClick={copyWebhook}><Copy size={14}/> Копировать</button></article>
  </div><div className="connection-note"><Settings size={16}/><p><strong>Почему ключи не вводятся здесь?</strong><span>Токены — секреты. Они добавляются в защищённые переменные среды, а не сохраняются в браузере или базе CRM.</span></p></div></ModalShell>;
}

function ProductModal({ data, close, done }: { data: ProductData; close: () => void; done: (product: ProductData) => void }) {
  const [form, setForm] = useState(data);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => { event.preventDefault(); const response = await fetch("/api/product", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const result = await response.json().catch(() => ({})); if (!response.ok) { setError(result.error || "Не удалось обновить метрики"); return; } done(result.product); };
  const field = (key: keyof ProductData, label: string, min=0, max?: number) => <label>{label}<input type="number" min={min} max={max} value={Number(form[key])} onChange={e=>setForm({...form,[key]:Number(e.target.value)})}/></label>;
  return <ModalShell icon={PackageCheck} kicker="ПРОДУКТ" title="Обновить ключевые метрики" copy="Значения сохранятся и обновят продуктовый дашборд." close={close} wide><form className="action-form form-grid" onSubmit={submit}>{field("activeStudents","Активные ученики")}{field("casesCount","Кейсы за период")}{field("nps","NPS",-100,100)}{field("completionRate","Доходимость, %",0,100)}{field("atRisk","В зоне риска")}{field("avgResultDays","Среднее время до результата, дней")}{error && <p className="form-error span-2">{error}</p>}<div className="form-actions span-2"><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" type="submit"><Save size={15}/> Сохранить</button></div></form></ModalShell>;
}
