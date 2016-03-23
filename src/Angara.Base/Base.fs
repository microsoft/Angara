namespace Angara

type Base() =
    static member Init() = 
        let serializers = [ Angara.ReinstateServices.Serializers; Angara.Html.Serializers ]
        Angara.Charting.Serializers.Register(serializers)
        Angara.Data.TableSerializers.Register(serializers)
