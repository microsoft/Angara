namespace Angara.Reinstate.AssemblyInfo

open System.Reflection
open System.Runtime.CompilerServices
open System.Runtime.InteropServices

module internal Const =
    [<Literal>]
    let Version = "0.1.1"

[<assembly: AssemblyTitle("Angara.Reinstate")>]
[<assembly: AssemblyDescription("Library that reinstates computation results either from the storage or recomputing a value from the function.")>]
[<assembly: AssemblyConfiguration("")>]
[<assembly: AssemblyCompany("Microsoft Research")>]
[<assembly: AssemblyProduct("Angara")>]
[<assembly: AssemblyCopyright("Copyright © Microsoft Research 2016")>]
[<assembly: AssemblyTrademark("")>]
[<assembly: AssemblyCulture("")>]

[<assembly: ComVisible(false)>]
[<assembly: Guid("d3c4dedf-431d-4816-b07c-4be07fdd687d")>]

[<assembly: AssemblyVersion(Const.Version + ".0")>]
[<assembly: AssemblyFileVersion(Const.Version + ".0")>]

do
    ()