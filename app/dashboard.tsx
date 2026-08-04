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
  ExternalLink,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MoreHorizontal,
  PackageCheck,
  Phone,
  Play,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  UsersRound,
  Video,
  Wallet,
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
  createdAt: string;
  lastActivity: string;
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

function MiniBars({ values, highlight = 8 }: { values: number[]; highlight?: number }) {
  return <div className="mini-bars" aria-label="Динамика показателя">{values.map((v, i) => <i key={i} className={i === highlight ? "active" : ""} style={{ height: `${v}%` }} />)}</div>;
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

  useEffect(() => {
    fetch("/api/leads").then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (data.clients?.length) {
        const normalized = data.clients.map((client: Client) => ({ ...client, createdAt: client.createdAt.includes("T") ? "Сегодня" : client.createdAt }));
        setClients(normalized);
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
        <div><Bot size={18} /><span>Telegram-бот</span><i /></div>
        <p>Синхронизация работает</p>
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
        {activeTab === "overview" && <Overview onOpen={changeTab} exportReport={exportReport} />}
        {activeTab === "youtube" && <Youtube exportReport={exportReport} />}
        {activeTab === "sales" && <Sales />}
        {activeTab === "crm" && <CRM clients={filteredClients} search={search} setSearch={setSearch} filter={stageFilter} setFilter={setStageFilter} openClient={setActiveClient} />}
        {activeTab === "finance" && <Finance />}
        {activeTab === "product" && <Product />}
        {activeTab === "automations" && <Automations reportEnabled={reportEnabled} setReportEnabled={setReportEnabled} nudgeEnabled={nudgeEnabled} setNudgeEnabled={setNudgeEnabled} syncEnabled={syncEnabled} setSyncEnabled={setSyncEnabled} setToast={setToast} />}
      </div>
    </main>

    {activeClient && <ClientDrawer client={activeClient} close={() => setActiveClient(null)} updateClient={updateClient} openReminder={() => setReminderOpen(true)} />}
    {reminderOpen && activeClient && <ReminderModal client={activeClient} close={() => setReminderOpen(false)} done={() => { setReminderOpen(false); setToast("Напоминание создано — бот напишет менеджеру"); }} />}
    {toast && <div className="toast"><span><Check size={15} /></span>{toast}</div>}
  </div>;
}

function Overview({ onOpen, exportReport }: { onOpen: (tab: Tab) => void; exportReport: () => void }) {
  const bars = [42, 48, 45, 58, 54, 65, 61, 74, 69, 82, 78, 94, 88, 100, 91, 106, 96, 112, 105, 119, 111, 126, 117, 132, 124, 139, 130, 148, 138, 154, 145];
  return <>
    <SectionHeading eyebrow="СВОДКА ЗА ИЮЛЬ" title="Бизнес растёт быстрее плана" copy="Все ключевые метрики в одном окне — от просмотра ролика до оплаты." action={<button className="primary-button" onClick={() => onOpen("crm")}><Plus size={16} /> Добавить заявку</button>} />
    <section className="metric-grid">
      <MetricCard label="Выручка" value="18,42 млн ₽" change="18,2%" hint="к июню" icon={CircleDollarSign} />
      <MetricCard label="Чистая прибыль" value="7,86 млн ₽" change="24,7%" hint="маржа 42,7%" icon={TrendingUp} />
      <MetricCard label="Расходы" value="6,18 млн ₽" change="4,8%" positive={false} hint="ниже плана" icon={Wallet} />
      <MetricCard label="Средний чек" value="134 450 ₽" change="9,2%" hint="137 продаж" icon={Target} />
    </section>

    <section className="overview-grid">
      <article className="panel revenue-panel">
        <div className="panel-head"><div><span className="panel-kicker">ДЕНЕЖНЫЙ ПОТОК</span><h3>Выручка и расходы</h3></div><div className="legend"><span><i className="legend-revenue" />Выручка</span><span><i className="legend-cost" />Расходы</span></div></div>
        <div className="revenue-summary"><div><strong>18,42 млн ₽</strong><Trend value="18,2%" /></div><p>План выполнен на <b>108%</b></p></div>
        <div className="bar-chart">
          <div className="y-axis"><span>800к</span><span>600к</span><span>400к</span><span>200к</span><span>0</span></div>
          <div className="bars-wrap">{bars.map((v, i) => <div className="bar-column" key={i}><i className="bar-revenue" style={{ height: `${Math.min(v / 1.6, 96)}%` }} /><i className="bar-cost" style={{ height: `${Math.min(v / 3.15 + (i % 4) * 3, 52)}%` }} /></div>)}</div>
          <div className="x-axis"><span>1 июл</span><span>8 июл</span><span>15 июл</span><span>22 июл</span><span>31 июл</span></div>
        </div>
      </article>

      <article className="panel funnel-panel">
        <div className="panel-head"><div><span className="panel-kicker">СКВОЗНАЯ ВОРОНКА</span><h3>От просмотра до продажи</h3></div><button className="ghost-icon" onClick={() => onOpen("sales")}><ExternalLink size={17} /></button></div>
        <div className="funnel-total"><strong>1 242 860</strong><span>просмотров</span><Trend value="14,6%" /></div>
        <div className="funnel-flow">
          {[
            ["Заявки", "1 836", "1,48%", 100], ["Диалоги", "1 092", "59,5%", 82], ["Звонки", "486", "44,5%", 62], ["Продажи", "137", "28,2%", 43],
          ].map((row, i) => <div className="funnel-row" key={row[0]}><div><span>{row[0]}</span><strong>{row[1]}</strong><em>{row[2]}</em></div><i><b style={{ width: `${row[3]}%` }} /></i>{i < 3 && <small>↓ {row[2]}</small>}</div>)}
        </div>
      </article>
    </section>

    <section className="lower-grid">
      <article className="panel video-table-panel">
        <div className="panel-head"><div><span className="panel-kicker">YOUTUBE</span><h3>Эффективность роликов</h3></div><button className="text-button" onClick={() => onOpen("youtube")}>Все ролики <ChevronRight size={15} /></button></div>
        <VideoTable compact />
      </article>
      <div className="side-stack">
        <article className="panel product-health">
          <div className="panel-head"><div><span className="panel-kicker">ПРОДУКТ</span><h3>Здоровье продукта</h3></div><button className="ghost-icon" onClick={() => onOpen("product")}><ChevronRight size={18} /></button></div>
          <div className="nps-ring"><div><strong>74</strong><span>NPS</span></div></div>
          <div className="health-stats"><div><strong>428</strong><span>активных учеников</span></div><div><strong>63</strong><span>кейса за месяц</span></div><div><strong>87%</strong><span>доходимость</span></div></div>
        </article>
        <article className="panel attention-card">
          <div className="attention-icon"><Clock3 size={18} /></div><div><span>Требуют внимания</span><strong>12 лидов без ответа</strong><p>Самый долгий — 38 минут</p></div><button onClick={() => onOpen("crm")}><ChevronRight size={17} /></button>
        </article>
      </div>
    </section>
    <button className="mobile-export" onClick={exportReport}><Download size={16} /> Экспортировать отчёт</button>
  </>;
}

function VideoTable({ compact = false }: { compact?: boolean }) {
  return <div className="table-scroll"><table className="data-table video-table"><thead><tr><th>Ролик</th><th>Просмотры</th><th>Заявки</th><th>Звонки</th><th>Продажи</th>{!compact && <th>CR заявки → продажа</th>}<th>Выручка</th><th>ROMI</th></tr></thead><tbody>
    {videos.slice(0, compact ? 4 : 5).map((video, index) => <tr key={video.title}><td><div className="video-name"><span className={`video-thumb ${video.accent}`}><Play size={14} fill="currentColor" /></span><div><strong>{video.title}</strong><small>{video.date} · #{index + 1}</small></div></div></td><td>{video.views}</td><td><b>{video.leads}</b></td><td>{video.calls}</td><td>{video.sales}</td>{!compact && <td><strong>{video.cr}</strong></td>}<td><strong>{video.revenue}</strong></td><td><span className="roi">{video.roi}</span></td></tr>)}
  </tbody></table></div>;
}

function Youtube({ exportReport }: { exportReport: () => void }) {
  return <>
    <SectionHeading eyebrow="СКВОЗНАЯ АНАЛИТИКА" title="YouTube → воронка → выручка" copy="Каждая заявка связана с роликом и UTM-меткой — видно, какой контент приносит деньги." action={<button className="secondary-button" onClick={exportReport}><Download size={16} /> Выгрузить отчёт</button>} />
    <section className="metric-grid youtube-metrics">
      <MetricCard label="Просмотры" value="1,24 млн" change="14,6%" hint="31 ролик" icon={Video} />
      <MetricCard label="Заявки" value="1 836" change="11,8%" hint="CPL 1 284 ₽" icon={FileText} />
      <MetricCard label="Выручка с YouTube" value="16,35 млн ₽" change="21,4%" hint="88,8% от общей" icon={CircleDollarSign} />
      <MetricCard label="ROMI контента" value="x10,7" change="1,8x" hint="затраты 1,53 млн ₽" icon={Gauge} />
    </section>
    <section className="youtube-summary-grid">
      <article className="panel channel-card">
        <div className="channel-top"><span className="youtube-logo"><Play size={24} fill="white" /></span><div><span>ОСНОВНОЙ КАНАЛ</span><h3>Александр К. — про бизнес</h3><p>824 560 подписчиков</p></div><button><ExternalLink size={17} /></button></div>
        <div className="channel-stats"><div><strong>31</strong><span>ролик за период</span></div><div><strong>40,1K</strong><span>средние просмотры</span></div><div><strong>5,9%</strong><span>ср. CTR обложек</span></div><div><strong>12:42</strong><span>ср. удержание</span></div></div>
      </article>
      <article className="panel content-cost-card"><div className="panel-head"><div><span className="panel-kicker">РАСХОДЫ НА КОНТЕНТ</span><h3>1,53 млн ₽</h3></div><Trend value="3,6%" positive={false} /></div><div className="cost-bar"><i style={{ width: "43%" }} /><i style={{ width: "27%" }} /><i style={{ width: "18%" }} /><i style={{ width: "12%" }} /></div><div className="cost-legend"><span><i />Продакшн <b>654к</b></span><span><i />Команда <b>412к</b></span><span><i />Дизайн <b>278к</b></span><span><i />Другое <b>186к</b></span></div></article>
    </section>
    <article className="panel full-table-panel"><div className="panel-head"><div><span className="panel-kicker">ВСЕ РОЛИКИ</span><h3>Контент в цифрах</h3></div><div className="table-actions"><button><Filter size={15} /> Фильтры</button><button><CalendarDays size={15} /> Июль</button></div></div><VideoTable /></article>
  </>;
}

function Sales() {
  return <>
    <SectionHeading eyebrow="ОТДЕЛ ПРОДАЖ" title="Команда выполняет план на 94%" copy="В реальном времени: нагрузка, скорость ответа, звонки, конверсии и выручка по каждому менеджеру." action={<button className="primary-button"><Plus size={16} /> Добавить менеджера</button>} />
    <section className="metric-grid">
      <MetricCard label="Новые заявки" value="1 836" change="11,8%" hint="59 в день" icon={FileText} />
      <MetricCard label="Проведено звонков" value="486" change="8,4%" hint="15,7 в день" icon={Phone} />
      <MetricCard label="Продаж" value="137" change="15,1%" hint="28,2% со звонка" icon={CircleDollarSign} />
      <MetricCard label="Средний первый ответ" value="5:48" change="1:12" hint="цель до 7 минут" icon={Clock3} />
    </section>
    <section className="sales-grid">
      <article className="panel sales-funnel"><div className="panel-head"><div><span className="panel-kicker">ВОРОНКА ПРОДАЖ</span><h3>Конверсия по этапам</h3></div><span className="live-chip"><i /> LIVE</span></div>
        <div className="sales-funnel-shape">
          {[{l:"Новые заявки",v:"1 836",p:"100%"},{l:"Вступили в диалог",v:"1 092",p:"59,5%"},{l:"Квалифицированы",v:"742",p:"67,9%"},{l:"Назначен звонок",v:"536",p:"72,2%"},{l:"Звонок проведён",v:"486",p:"90,7%"},{l:"Оплачено",v:"137",p:"28,2%"}].map((item, i) => <div key={item.l} style={{ width: `${100 - i * 8}%` }}><span>{item.l}</span><strong>{item.v}</strong><em>{item.p}</em></div>)}
        </div>
      </article>
      <article className="panel response-panel"><div className="panel-head"><div><span className="panel-kicker">СКОРОСТЬ ОТВЕТА</span><h3>Сегодня</h3></div><span className="goal-chip">Цель &lt; 7 мин</span></div><div className="speed-score"><span><Zap size={23} /></span><div><strong>4:36</strong><p>среднее время ответа</p></div><Trend value="18% быстрее" /></div><MiniBars values={[46,51,62,56,70,48,72,80,67,82,74,91,84,77,88,69,85,94,78,87,76,90,84,96]} highlight={23} /><div className="speed-footer"><span>09:00</span><span>Сейчас, 12:34</span></div><div className="sla-row"><span><i className="good" />В SLA</span><b>86%</b><span><i className="warn" />Просрочено</span><b>14%</b></div></article>
    </section>
    <article className="panel manager-panel"><div className="panel-head"><div><span className="panel-kicker">КОМАНДА</span><h3>Результаты менеджеров</h3></div><button className="text-button">Настроить план <ChevronRight size={15} /></button></div><div className="table-scroll"><table className="data-table manager-table"><thead><tr><th>Менеджер</th><th>Заявки</th><th>Звонки</th><th>Продажи</th><th>Конверсия</th><th>Средний ответ</th><th>Выручка</th><th>План</th></tr></thead><tbody>{managers.map((m,i)=><tr key={m.name}><td><div className="manager-name"><span className={`manager-avatar c${i}`}>{m.initials}</span><div><strong>{m.name}</strong><small>{i < 3 ? "В сети" : "Был(а) 18 мин назад"}</small></div></div></td><td>{m.leads}</td><td>{m.calls}</td><td><strong>{m.sales}</strong></td><td><span className="conversion">{m.cr}</span></td><td>{m.response}</td><td><strong>{m.revenue}</strong></td><td><div className="plan-cell"><span><i style={{width:`${Math.min(m.plan,100)}%`}} /></span><b>{m.plan}%</b></div></td></tr>)}</tbody></table></div></article>
  </>;
}

function CRM({ clients, search, setSearch, filter, setFilter, openClient }: { clients: Client[]; search: string; setSearch: (v: string) => void; filter: string; setFilter: (v: string) => void; openClient: (c: Client) => void }) {
  return <>
    <SectionHeading eyebrow="ЕДИНАЯ БАЗА" title="CRM — все заявки" copy="Лид появляется автоматически из Telegram-бота вместе с анкетой, UTM и роликом-источником." action={<button className="primary-button"><Plus size={16} /> Новая заявка</button>} />
    <section className="crm-pipeline">{[{l:"Новые",v:42,c:"blue"},{l:"В диалоге",v:68,c:"purple"},{l:"Квалифицированы",v:51,c:"cyan"},{l:"Звонок",v:34,c:"orange"},{l:"Думают",v:19,c:"yellow"},{l:"Оплачено",v:27,c:"green"}].map(s=><button key={s.l} onClick={() => setFilter(s.l === "Новые" ? "Новая" : s.l === "В диалоге" ? "Диалог" : s.l === "Оплачено" ? "Оплачено" : "Все статусы")}><i className={s.c} /><span>{s.l}</span><strong>{s.v}</strong><ChevronRight size={15} /></button>)}</section>
    <article className="panel crm-table-panel">
      <div className="crm-toolbar"><label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Найти клиента, контакт или UTM..." /></label><div><label className="filter-select"><Filter size={15} /><select value={filter} onChange={e => setFilter(e.target.value)}><option>Все статусы</option><option>Новая</option><option>Диалог</option><option>Звонок</option><option>Думает</option><option>Оплачено</option><option>Не целевой</option></select><ChevronDown size={13} /></label><button className="secondary-button"><Download size={15} /> Экспорт</button></div></div>
      <div className="table-scroll"><table className="data-table crm-table"><thead><tr><th>Клиент</th><th>Статус</th><th>Источник / UTM</th><th>Доход</th><th>Менеджер</th><th>Последняя активность</th><th /></tr></thead><tbody>{clients.map((client,i)=><tr key={client.id} onClick={() => openClient(client)}><td><div className="manager-name"><span className={`client-avatar c${i%4}`}>{client.name.split(" ").map(n=>n[0]).join("")}</span><div><strong>{client.name}</strong><small>{client.contact} · {client.ageGroup}</small></div></div></td><td><Status value={client.stage} /></td><td><div className="source-cell"><strong><Play size={12} fill="currentColor" /> {client.source}</strong><small>{client.utm}</small></div></td><td><span>{client.incomeBand}</span></td><td>{client.manager}</td><td><div className="activity-cell"><strong>{client.lastActivity}</strong><small>{client.responseMinutes ? `Первый ответ: ${client.responseMinutes} мин` : "Ждёт ответа"}</small></div></td><td><button className="row-arrow"><ChevronRight size={17} /></button></td></tr>)}</tbody></table>{clients.length === 0 && <div className="empty-state"><Search size={22} /><strong>Ничего не найдено</strong><p>Попробуйте изменить запрос или фильтр.</p></div>}</div>
    </article>
  </>;
}

function Finance() {
  return <>
    <SectionHeading eyebrow="P&L В РЕАЛЬНОМ ВРЕМЕНИ" title="Финансы без ручных таблиц" copy="Доходы, расходы и чистая прибыль с детализацией до статьи и направления." action={<button className="primary-button"><Plus size={16} /> Внести расход</button>} />
    <section className="finance-hero">
      <article className="profit-card"><span>ЧИСТАЯ ПРИБЫЛЬ · ИЮЛЬ</span><strong>7 862 400 ₽</strong><div><Trend value="24,7%" /><p>+1,56 млн ₽ к июню</p></div><MiniBars values={[38,46,44,55,51,62,59,74,66,78,71,82,75,91,83,88,80,96,87,100]} highlight={19} /></article>
      <article className="panel finance-breakdown"><div className="finance-line"><span><i className="green-dot" />Доходы</span><strong>18 420 600 ₽</strong><Trend value="18,2%" /></div><div className="finance-line"><span><i className="red-dot" />Расходы</span><strong>6 184 200 ₽</strong><Trend value="4,8%" positive={false} /></div><div className="finance-line"><span><i className="gray-dot" />Налоги и резервы</span><strong>4 374 000 ₽</strong><span className="neutral-chip">23,7%</span></div><div className="finance-margin"><span>Маржинальность</span><strong>42,7%</strong><div><i style={{width:"42.7%"}} /></div></div></article>
    </section>
    <section className="finance-grid">
      <article className="panel expense-chart"><div className="panel-head"><div><span className="panel-kicker">СТРУКТУРА РАСХОДОВ</span><h3>6,18 млн ₽</h3></div><button className="ghost-icon"><MoreHorizontal size={18}/></button></div><div className="expense-layout"><div className="expense-ring"><div><strong>33%</strong><span>команда</span></div></div><div className="expense-list">{[["Команда","2,04 млн ₽","33%","violet"],["Маркетинг","1,62 млн ₽","26%","blue"],["YouTube","1,53 млн ₽","25%","cyan"],["Сервисы","582 тыс. ₽","9%","orange"],["Прочее","412 тыс. ₽","7%","gray"]].map(x=><div key={x[0]}><span><i className={x[3]} />{x[0]}</span><strong>{x[1]}</strong><em>{x[2]}</em></div>)}</div></div></article>
      <article className="panel income-products"><div className="panel-head"><div><span className="panel-kicker">ДОХОД ПО ПРОДУКТАМ</span><h3>Структура выручки</h3></div></div>{[["Основная программа","14,86 млн ₽",81],["VIP-сопровождение","2,38 млн ₽",13],["Интенсив","1,18 млн ₽",6]].map((x,i)=><div className="product-income" key={x[0]}><div><span>{x[0]}</span><strong>{x[1]}</strong></div><p><i className={`p${i}`} style={{width:`${x[2]}%`}} /></p><em>{x[2]}%</em></div>)}<div className="income-note"><Sparkles size={16}/><p><strong>Основная программа растёт</strong><span>+23% к прошлому месяцу</span></p></div></article>
    </section>
    <article className="panel transactions"><div className="panel-head"><div><span className="panel-kicker">ПОСЛЕДНИЕ ОПЕРАЦИИ</span><h3>Доходы и расходы</h3></div><button className="text-button">Все операции <ChevronRight size={15}/></button></div>{[["Оплата · Дарья Смирнова","Основная программа","Сегодня, 10:42","+149 000 ₽",true],["Монтаж роликов · Июль","YouTube","Сегодня, 09:18","−184 000 ₽",false],["Оплата · Артём Фролов","VIP-сопровождение","Вчера, 18:51","+249 000 ₽",true],["Зарплата команды продаж","Команда","Вчера, 15:00","−786 000 ₽",false]].map((x,i)=><div className="transaction" key={x[0]}><span className={x[4]?"income":"outcome"}>{x[4]?<ArrowDownRight size={17}/>:<ArrowUpRight size={17}/>}</span><div><strong>{x[0]}</strong><small>{x[1]} · {x[2]}</small></div><b className={x[4]?"plus":"minus"}>{x[3]}</b></div>)}</article>
  </>;
}

function Product() {
  return <>
    <SectionHeading eyebrow="ЗДОРОВЬЕ ПРОДУКТА" title="Ученики получают результат" copy="Динамика обучения, кейсы, NPS и сигналы риска — в одном продуктном контуре." action={<button className="secondary-button"><Download size={16} /> Отчёт по продукту</button>} />
    <section className="product-hero-grid">
      <article className="nps-card"><div><span>NPS · ИЮЛЬ</span><strong>74</strong><Trend value="6 пунктов" /></div><div className="nps-big-ring"><span><b>81%</b><small>промоутеры</small></span></div><p>526 ответов из 684 приглашений</p></article>
      <article className="panel students-card"><div className="panel-head"><div><span className="panel-kicker">УЧЕНИКИ</span><h3>428 активных</h3></div><Trend value="12,4%" /></div><div className="cohort-bars">{[52,68,73,82,88,75,91,96].map((v,i)=><i key={i} style={{height:`${v}%`}}><span>{v}</span></i>)}</div><div className="cohort-labels"><span>Нед. 1</span><span>Нед. 8</span></div></article>
      <article className="panel case-card"><div className="case-icon"><Sparkles size={21}/></div><span>КЕЙСЫ ЗА ИЮЛЬ</span><strong>63</strong><p>+18 к прошлому месяцу</p><button>Посмотреть кейсы <ChevronRight size={15}/></button></article>
    </section>
    <section className="product-metrics-grid"><article className="panel"><span className="panel-kicker">ДОХОДИМОСТЬ</span><div className="big-row"><strong>87%</strong><Trend value="4,2%" /></div><p>Прошли больше 70% программы</p><div className="progress thick"><i style={{width:"87%"}} /></div></article><article className="panel"><span className="panel-kicker">СРЕДНЕЕ ВРЕМЯ ДО РЕЗУЛЬТАТА</span><div className="big-row"><strong>5,4 недели</strong><Trend value="0,8 нед." /></div><p>От старта до первого подтверждённого кейса</p><MiniBars values={[44,58,52,68,61,76,73,82,78,91,84,95]} highlight={11}/></article><article className="panel"><span className="panel-kicker">В ЗОНЕ РИСКА</span><div className="big-row"><strong>34 ученика</strong><span className="warning-chip">8%</span></div><p>Нет активности более 7 дней</p><button className="outline-warning">Передать кураторам <ChevronRight size={15}/></button></article></section>
    <article className="panel modules-panel"><div className="panel-head"><div><span className="panel-kicker">ПРОГРАММА</span><h3>Прохождение по модулям</h3></div><button className="text-button">Когорты <ChevronDown size={14}/></button></div>{[["01","Фундамент и стратегия",96,411],["02","Позиционирование",91,389],["03","Продуктовая матрица",84,359],["04","Контент и трафик",76,325],["05","Продажи и система",68,291],["06","Масштабирование",54,231]].map(x=><div className="module-row" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><div><i style={{width:`${x[2]}%`}} /></div><b>{x[2]}%</b><small>{x[3]} учеников</small></div>)}</article>
  </>;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button className={`toggle ${checked ? "on" : ""}`} onClick={onChange} role="switch" aria-checked={checked}><i /></button>;
}

function Automations({ reportEnabled, setReportEnabled, nudgeEnabled, setNudgeEnabled, syncEnabled, setSyncEnabled, setToast }: { reportEnabled: boolean; setReportEnabled: (v:boolean)=>void; nudgeEnabled:boolean; setNudgeEnabled:(v:boolean)=>void; syncEnabled:boolean; setSyncEnabled:(v:boolean)=>void; setToast:(v:string)=>void }) {
  return <>
    <SectionHeading eyebrow="TELEGRAM + CRM" title="Автоматизации, которые не дают терять лидов" copy="Бот собирает заявки, напоминает менеджерам о дожиме и отправляет руководителю ежедневный отчёт." action={<button className="primary-button" onClick={()=>setToast("Новый сценарий создан как черновик")}><Plus size={16}/> Новый сценарий</button>} />
    <section className="integration-status"><div className="telegram-mark"><Bot size={25}/></div><div><span>TELEGRAM WORKSPACE</span><strong>@lumo_sales_bot подключён</strong><p>Последняя синхронизация: только что · 4 чата · 8 менеджеров</p></div><span className="connected"><i/>Система работает</span><button><Settings size={16}/> Настроить</button></section>
    <section className="automation-grid">
      <article className="panel automation-card featured"><div className="automation-top"><span className="automation-icon"><FileText size={19}/></span><Toggle checked={syncEnabled} onChange={()=>setSyncEnabled(!syncEnabled)}/></div><span className="panel-kicker">ВХОДЯЩИЕ ЗАЯВКИ</span><h3>Telegram → CRM</h3><p>Создаёт карточку клиента, переносит анкету, UTM и ролик, назначает свободного менеджера.</p><div className="automation-flow"><span>Telegram</span><ChevronRight size={15}/><span>Квалификация</span><ChevronRight size={15}/><span>CRM</span></div><footer><span><Activity size={14}/> Сегодня обработано: <b>59</b></span><button><ChevronRight size={16}/></button></footer></article>
      <article className="panel automation-card"><div className="automation-top"><span className="automation-icon orange"><Bell size={19}/></span><Toggle checked={nudgeEnabled} onChange={()=>setNudgeEnabled(!nudgeEnabled)}/></div><span className="panel-kicker">ДОЖИМ ЛИДОВ</span><h3>Напоминания менеджерам</h3><p>Тегает ответственного в Telegram в нужное время и повторно напоминает, если задача не закрыта.</p><div className="rule-line"><span>Если нет ответа</span><strong>через 15 мин</strong></div><div className="rule-line"><span>Повторная эскалация</span><strong>через 30 мин</strong></div><footer><span><Bell size={14}/> Сегодня отправлено: <b>17</b></span><button><ChevronRight size={16}/></button></footer></article>
      <article className="panel automation-card"><div className="automation-top"><span className="automation-icon green"><BarChart3 size={19}/></span><Toggle checked={reportEnabled} onChange={()=>setReportEnabled(!reportEnabled)}/></div><span className="panel-kicker">ЕЖЕДНЕВНАЯ СВОДКА</span><h3>Отчёт руководителю</h3><p>Каждый день собирает ключевые метрики команды и присылает их одним сообщением.</p><div className="rule-line"><span>Время отправки</span><strong>20:30 · НСК</strong></div><div className="rule-line"><span>Получатели</span><strong>3 человека</strong></div><footer><span><Clock3 size={14}/> Следующий: <b>сегодня</b></span><button><ChevronRight size={16}/></button></footer></article>
    </section>
    <section className="bot-preview-grid">
      <article className="panel bot-preview"><div className="panel-head"><div><span className="panel-kicker">ПРЕДПРОСМОТР</span><h3>Ежедневный отчёт</h3></div><span className="telegram-chip">Telegram</span></div><div className="phone-message"><div className="message-head"><span className="brand-mark"><Sparkles size={14}/></span><div><strong>LUMO · Итоги дня</strong><small>5 августа · 20:30</small></div></div><p>Команда, итоги на сегодня 👇</p><div className="message-metrics"><span><b>59</b> заявок</span><span><b>18</b> звонков</span><span><b>6</b> продаж</span></div><div className="message-revenue"><span>Выручка за день</span><strong>814 000 ₽</strong></div><p>Конверсии:<br/>Заявка → звонок: <b>30,5%</b><br/>Звонок → продажа: <b>33,3%</b><br/>Заявка → продажа: <b>10,2%</b></p><div className="message-footer"><span>План дня выполнен на 112% 🔥</span><small>20:30</small></div></div></article>
      <article className="panel activity-log"><div className="panel-head"><div><span className="panel-kicker">ЖУРНАЛ</span><h3>Последние срабатывания</h3></div><button className="text-button">Весь журнал <ChevronRight size={15}/></button></div>{[["Заявка создана в CRM","Анна Волкова · yt_income_300","2 мин назад","blue"],["Менеджер получил напоминание","@maria_sales · Максим Соколов","12 мин назад","orange"],["Лид назначен автоматически","Илья Козлов → Алексей Белов","26 мин назад","purple"],["Эскалация руководителю","Лид #1842 без ответа 31 мин","48 мин назад","red"],["Данные звонка синхронизированы","Дарья Смирнова · 18:42 мин","1 ч назад","green"]].map(x=><div className="log-row" key={x[0]}><span className={x[3]}><Check size={14}/></span><div><strong>{x[0]}</strong><small>{x[1]}</small></div><time>{x[2]}</time></div>)}</article>
    </section>
  </>;
}

function ClientDrawer({ client, close, updateClient, openReminder }: { client: Client; close: () => void; updateClient: (id:number, patch:Partial<Client>)=>void; openReminder:()=>void }) {
  return <><button className="drawer-backdrop" onClick={close} aria-label="Закрыть карточку"/><aside className="client-drawer">
    <header><div><span className="client-big-avatar">{client.name.split(" ").map(n=>n[0]).join("")}</span><div><h2>{client.name}</h2><a href={`https://t.me/${client.contact.replace("@","")}`}>{client.contact}<ExternalLink size={12}/></a></div></div><button onClick={close}><X size={20}/></button></header>
    <div className="drawer-actions"><button className="primary-button"><MessageCircle size={16}/> Написать</button><button className="secondary-button"><Phone size={16}/> Звонок</button><button className="secondary-button" onClick={openReminder}><Bell size={16}/></button></div>
    <section className="drawer-section"><span className="panel-kicker">ЭТАП СДЕЛКИ</span><label className="drawer-select"><select value={client.stage} onChange={e=>updateClient(client.id,{stage:e.target.value})}><option>Новая</option><option>Диалог</option><option>Звонок</option><option>Думает</option><option>Оплачено</option><option>Не целевой</option></select><ChevronDown size={15}/></label><div className="stage-track"><i/><i/><i className={client.stage!=="Новая"?"done":""}/><i className={["Звонок","Думает","Оплачено"].includes(client.stage)?"done":""}/><i className={client.stage==="Оплачено"?"done":""}/></div></section>
    <section className="drawer-section"><span className="panel-kicker">ОТВЕТСТВЕННЫЙ</span><div className="responsible"><span className="manager-avatar c0">МС</span><label><select value={client.manager} onChange={e=>updateClient(client.id,{manager:e.target.value})}><option>Не назначен</option><option>Мария</option><option>Алексей</option><option>Денис</option><option>Ольга</option></select><ChevronDown size={14}/></label><small>{client.manager === "Не назначен" ? "Назначьте менеджера" : "В сети"}</small></div></section>
    <section className="drawer-section"><span className="panel-kicker">АНКЕТА КЛИЕНТА</span><div className="details-grid"><div><span>Возраст</span><strong>{client.ageGroup}</strong></div><div><span>Доход</span><strong>{client.incomeBand}</strong></div><div><span>Источник</span><strong>YouTube</strong></div><div><span>Первый ответ</span><strong>{client.responseMinutes ? `${client.responseMinutes} мин` : "—"}</strong></div></div></section>
    <section className="drawer-section"><span className="panel-kicker">АТРИБУЦИЯ</span><div className="source-card"><span className="video-thumb blue"><Play size={14} fill="currentColor"/></span><div><strong>{client.video}</strong><small>utm_campaign: {client.utm}</small></div><ChevronRight size={16}/></div></section>
    <section className="drawer-section"><div className="drawer-section-head"><span className="panel-kicker">ИСТОРИЯ</span><button>Добавить заметку</button></div><div className="timeline"><div><i className="green"/><span>Сегодня, 11:26</span><strong>Назначен звонок на 14:30</strong><p>Менеджер: {client.manager}</p></div><div><i className="blue"/><span>Сегодня, 10:46</span><strong>Первое сообщение менеджера</strong><p>Время ответа: {client.responseMinutes || 4} минуты</p></div><div><i/><span>{client.createdAt}</span><strong>Заявка создана из Telegram</strong><p>UTM и анкета добавлены автоматически</p></div></div></section>
    <button className="reminder-wide" onClick={openReminder}><Bell size={16}/> Поставить напоминание о дожиме</button>
  </aside></>;
}

function ReminderModal({ client, close, done }: { client: Client; close:()=>void; done:()=>void }) {
  const [date, setDate] = useState("2026-08-05T16:30");
  const [message, setMessage] = useState(`Написать ${client.name.split(" ")[0]} и уточнить решение по программе`);
  const submit = (e:FormEvent) => { e.preventDefault(); fetch("/api/reminders", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientId:client.id,manager:client.manager,message,remindAt:date})}).catch(()=>undefined); done(); };
  return <div className="modal-wrap"><button className="modal-backdrop" onClick={close}/><form className="reminder-modal" onSubmit={submit}><header><div><span className="automation-icon orange"><Bell size={18}/></span><div><span>НАПОМИНАНИЕ</span><h3>Дожим лида</h3></div></div><button type="button" onClick={close}><X size={19}/></button></header><p>Бот отправит сообщение менеджеру в Telegram и добавит задачу в карточку.</p><label>Клиент<input value={client.name} disabled/></label><label>Ответственный<select value={client.manager} disabled><option>{client.manager}</option></select></label><label>Дата и время<input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} required/></label><label>Сообщение<textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3}/></label><div><button type="button" className="secondary-button" onClick={close}>Отмена</button><button className="primary-button" type="submit">Создать напоминание</button></div></form></div>;
}
