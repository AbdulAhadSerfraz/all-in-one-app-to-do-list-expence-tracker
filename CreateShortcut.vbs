Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.ExpandEnvironmentStrings("%USERPROFILE%") & "\Desktop\HabitSync.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = "D:\own\project\app\all in one app to do list expence tracker\StartApp.bat"
oLink.IconLocation = "C:\Users\abdul\Downloads\habitsync_mB1_icon"
oLink.Save
