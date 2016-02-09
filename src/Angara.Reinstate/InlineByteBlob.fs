namespace Angara.Persistence

type internal InlineByteBlob(b : byte[]) =
    interface Angara.Serialization.IBlob with
        member x.GetStream() =
             let ms = new System.IO.MemoryStream(b, false)
             ms.Position <- 0L
             upcast ms
        member x.WriteTo stream = stream.Write(b,0,b.Length)