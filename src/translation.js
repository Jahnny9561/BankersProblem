export const resources = {
  en: {
    // Titles & UI
    setupTitle: "1. Setup",
    simTitle: "2. Simulation",
    randomize: "Randomize",
    reset: "RESET",
    visual: "Visual",
    instant: "Instant",

    // Inputs
    totalRes: "Total Resources:",
    procCount: "Processes:",
    initialAvail: "Initial Available:",
    startBtn: "START SIMULATION",

    // Table Headers
    colProc: "Proc",
    colAlloc: "Allocated",
    colMax: "Max Need",

    // Game UI
    resLabel: "RESOURCES",
    needsLabel: "NEEDS",
    reqBtn: "+1 Request",
    deniedBtn: "Denied",
    ok: "OK",

    // Footer
    logTitle: "KERNEL LOG",
    availTitle: "AVAILABLE",

    // Logs & Messages
    logSetup: "Setup the system or click RANDOMIZE.",
    logRandom: "Generated Random Scenario",
    logWait: "waits (Not enough resources)",
    logDenied: "DENIED. Causes DEADLOCK.",
    logGranted: "Granted 1 to",
    logFinish: "FINISHED! Returning resources.",
    logWon: "SYSTEM SOLVED!",

    // Win Screen
    wonTitle: "Deadlock Avoided!",
    wonSub: "System executed safely.",
    newSimBtn: "New Simulation",

    // Visualizer
    v0: "// Waiting for player move...",
    v1: "Request Resource(P)...",
    v2: "SAFETY CHECK: Will system be Safe?",
    v3: "[UNSAFE]: Request Denied.",
    v4: "[SAFE]: Granted 1 Unit.",
    v5: "CHECK: Did Process finish?",
    v6: "[COMPLETE]: Release ALL resources!",
  },

  bg: {
    // Titles & UI
    setupTitle: "1. Конфигурация",
    simTitle: "2. Симулация",
    randomize: "Случайни Процеси",
    reset: "Рестарт",
    visual: "Постъпково",
    instant: "Автоматично",

    // Inputs
    totalRes: "Налични Ресурси:",
    procCount: "Брой Процеси:",
    initialAvail: "Налични в началото:",
    startBtn: "СТАРТИРАЙ",

    // Table Headers
    colProc: "Процес",
    colAlloc: "Заети",
    colMax: "Максимално Нужни",

    // Game UI
    resLabel: "РЕСУРСИ",
    needsLabel: "НУЖНИ",
    reqBtn: "+1 Заявка",
    deniedBtn: "Отказано",
    ok: "ГОТОВ",

    // Footer
    logTitle: "СИСТЕМЕН ЛОГ",
    availTitle: "НАЛИЧНИ",

    // Logs & Messages
    logSetup: "Настройте системата или изберете СЛУЧАЙНИ ПРОЦЕСИ.",
    logRandom: "Генериран е случаен сценарий",
    logWait: "чака (Няма ресурси)",
    logDenied: "ОТКАЗ. Риск от Deadlock.",
    logGranted: "Разрешен 1 на",
    logFinish: "ПРИКЛЮЧИ! Връща ресурси.",
    logWon: "СИСТЕМАТА Е РЕШЕНА!",

    // Win Screen
    wonTitle: "Deadlock Избегнат!",
    wonSub: "Системата работи безопасно.",
    newSimBtn: "Нова Симулация",

    // Visualizer
    v0: "// Чака се действие...",
    v1: "Заявка за Ресурс...",
    v2: "SAFETY CHECK: Безопасно ли е?",
    v3: "[UNSAFE]: Заявката отказана.",
    v4: "[SAFE]: Разрешена 1 Единица.",
    v5: "ПРОВЕРКА: Процесът готов ли е?",
    v6: "[COMPLETE]: Освободи ВСИЧКО!",
  },
};
