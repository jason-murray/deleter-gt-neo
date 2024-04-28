#Requires AutoHotkey v2.0
#SingleInstance

SetTitleMatchMode 3

supportAppsRunning := true

Base64PNG := ' ; iRacing Logo
(
    iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAQJQTFRFGkJ/JkyFG0N/HkWANlmOyNLfL1OKQWGTwMra4ufup7bMMVWLtMHT/v7+1dznOVyPLlOJ0trk+/z9////eZGzJUuEt8TU///+8bCv2uDpLVKJK1CHMVWKQ2SVpbXK9/j5fZS1KE2GusbWs8HT4jY09tHQ1NzlRWWWxtDdvMjZx9De8/X3Um+dKk+HyNHf3ePq4iYl5lZW/PPz9/n6w83b2d/n2eDp3uTp8vT2mqzFwMza7/L2YX2m5llZ+/Ly/f39+vz8/f3+cImt5EpJ+Nzb9Pb4d4+y6n58sL7S4z49/fb2boes4iop+eHg9srJ1d3nHESA9MHBtsPV4icn99bWprXMfa6FoQAAALFJREFUeJxljr0LwVEUhs8jH4OUkq9IvgaDJKUMSvl3lSzKIEoopQwymLBIsRgs5OPcy8/AO7zvPc8995yL/Ig/wNOmi7tNNx6umj5UF733E4CzBLUUThLWjN287BOmgW2GY4Q8h7ie3tpkj5Rhl/7U6wJjyhJgJUWWOrrEQBRIiIVdWaH/sECicwuqPfMxA+LMDKh1HZBkal5MLw6Q1EStTucLMiO1RlsckGOo3mwZ8AKqkiR1QHu25QAAAABJRU5ErkJggg==
)'

TraySetIcon('HICON: ' . Base64PNG_to_HICON(Base64PNG))

appName := "iR Launch Control v1"

A_TrayMenu.Delete()
A_TrayMenu.Add(appName, MenuHandler)
A_TrayMenu.Disable(appName)
A_TrayMenu.Add()
A_TrayMenu.Add("Launch iRacing", MenuHandler)
A_TrayMenu.Add()
A_TrayMenu.Add("Run Stream Apps", MenuHandler)
A_TrayMenu.Add("Snap Windows", MenuHandler)
A_TrayMenu.Add("Chat AOT", MenuHandler)
A_TrayMenu.Add()
A_TrayMenu.Add("iRacing Folder", MenuHandler)
A_TrayMenu.Add()
A_TrayMenu.Add("Kill Apps", MenuHandler)
A_TrayMenu.Add("Run Apps", MenuHandler)
A_TrayMenu.Add()
A_TrayMenu.Add("Quit", MenuHandler)

A_TrayMenu.Default := "Launch iRacing"

MenuHandler(ItemName, ItemPos, MyMenu) {

    switch ItemName {
        case "Launch iRacing":
            
            if WinExist("iRacing")
                WinRestore
            else
                Run "iRacingUI.exe", "C:\Program Files (x86)\iRacing\ui"

        case "Run Stream Apps":
            RunStreamApps()

        case "Chat AOT":
            ChatAOT()

        case "Stream Manager AOT":
            ChatAOT()

        case "Snap Windows":
            SnapWindows()

        case "iRacing Folder":
            Run "explore " A_MyDocuments "\iRacing\"

        case "Kill Apps":
            KillApps()

        case "Run Apps":
            RunApps()

        case "Quit":
            ExitApp
    }
}

while 1 {
    Sleep 500
    
    PID := ProcessExist("iRacingUI.exe")
    if (PID = 0) {
        if (supportAppsRunning = true) {
            KillApps()

            global supportAppsRunning := false
        }
        continue
    }

    if (supportAppsRunning = false) {
        RunApps()
    }


}

KillApps() {
    ProcessClose("Trading Paints.exe")
    ProcessClose("iOverlay.exe")
    ProcessClose("VRS-TelemetryLogger.exe")
    ProcessClose("SimHubWPF.exe") ;SH no play nice with force close

    ProcessClose("VRS Data Packs Sync.exe")
    ProcessClose("simpro2.exe")

    for process in ComObjGet("winmgmts:").ExecQuery("Select * from Win32_Process where Name like '%garage61%'") {
        ProcessClose(process.Name)
    }
}

RunApps() {

    if (!ProcessExist("SimHubWPF.exe")) {
        Run "SimHubWPF.exe", "C:\Program Files (x86)\SimHub"
    }

    Run "simpro2.exe", "C:\Program Files\simpro2", "Min"
    Run "Trading Paints.exe", "C:\Program Files (x86)\Rhinode LLC\Trading Paints\", "Min"
    Run "iOverlay.exe", "C:\Program Files\iOverlay\"
    Run "VRS-TelemetryLogger.exe", "C:\Users\" A_UserName "\VirtualRacingSchool\", "Min"
    Run "VRS Data Packs Sync.exe", "C:\Users\" A_UserName "\AppData\Local\VRS Data Packs Sync", "Min"
    Run "garage61-launcher.exe", "C:\Users\" A_UserName "\AppData\Roaming\garage61-install"


    Sleep 4000

    if WinExist("VRS TelemetryLogger")
        WinClose

    if WinExist("Trading Paints")
        WinClose

    global supportAppsRunning := true
}

RunStreamApps() {
    Run "Streamer.bot.exe", "C:\Users\" A_UserName "\Streamer.bot"
    Run "Speaker.bot.exe", "C:\Users\" A_UserName "\Speaker.bot"
    Run "min.exe", "C:\Users\" A_UserName "\AppData\Local\min"
    Run "chatterino.exe", "C:\Program Files\Chatterino"
    Run "obs64.exe", "C:\Program Files\obs-studio\bin\64bit"

    Sleep 12000

    if WinExist("Streamer.bot - Streamer.bot (0.2.3)")
        WinMinimize

    if WinExist("ahk_exe Speaker.bot.exe")
        WinMinimize

    if WinExist("Chat")
        WinSetAlwaysOnTop

    if WinExist("Min")
        WinSetAlwaysOnTop

    SnapWindows()
}

ChatAOT() {
    if WinExist("Chat")
        WinSetAlwaysOnTop
}

SnapWindows() {
    if WinExist("iRacing")
        WinMove 1278, -1, 2565, 1394

    if WinExist("Min")
        WinMove 428, 0, 569, 395

    if WinExist("ahk_exe obs64.exe")
        WinMove 3840, 0, 1286, 993

    if WinExist("ahk_exe Discord.exe")
        WinMove 0, 0, 1275, 953

    if WinExist("ahk_exe Spotify.exe")
        WinMove 0, 440, 1275, 953
}

Base64PNG_to_HICON(Base64PNG, height := 16) {
    size := StrLen( RTrim(Base64PNG, '=') )*3//4
    if DllCall('Crypt32\CryptStringToBinary', 'Str', Base64PNG, 'UInt', StrLen(Base64PNG), 'UInt', 1,
                                              'Ptr', buf := Buffer(size), 'UIntP', &size, 'Ptr', 0, 'Ptr', 0)
        return DllCall('CreateIconFromResourceEx', 'Ptr', buf, 'UInt', size, 'UInt', true,
                                                   'UInt', 0x30000, 'Int', height, 'Int', height, 'UInt', 0)
    return 0
}