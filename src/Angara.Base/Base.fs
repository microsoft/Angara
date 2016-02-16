namespace Angara

type Base() =
    static member Init() = 
        let serializers = [ Angara.ReinstateServices.Serializers; Angara.Html.UISerializers ]
        Angara.Charting.Serializers.Register(serializers)
