namespace Angara.Persistence

open System
open System.IO
open Angara.Serialization

type internal FolderBlobWriter(rootFolder, name) =
    let fullPath = Path.GetFullPath(rootFolder)
    do 
        if String.IsNullOrEmpty name then
            if not(Directory.Exists(fullPath)) 
            then Directory.CreateDirectory(fullPath) |> ignore
            else Directory.GetFiles(fullPath) |> Seq.iter(fun f -> File.Delete(f))
                 Directory.GetDirectories(fullPath) |> Seq.iter(fun f -> Directory.Delete(f, true))

    new(folder : string) = FolderBlobWriter(folder, "")

    interface IBlobWriter with
        member x.AddGroup groupName =
            if not(String.IsNullOrEmpty name) then 
                let newFolder = Path.Combine(fullPath, name)
                Directory.CreateDirectory(newFolder) |> ignore
                upcast FolderBlobWriter(newFolder, groupName)
            else
                upcast FolderBlobWriter(fullPath, groupName)
             
        member x.Write(n, blob) =
            let path = Path.Combine(fullPath, if String.IsNullOrEmpty(name) then n else name + "." + n)
            if File.Exists(path) then raise(System.InvalidOperationException(sprintf "Duplicate blob path %s" path))
            try 
                use tgt = File.OpenWrite(path)
                blob.GetStream().CopyTo(tgt)
                tgt.Close()
            with e -> raise(System.InvalidOperationException(sprintf "Cannot create file %s" path, e))
   
type internal FolderBlobReader(rootFolder : string, name : string) =
    let fullPath = Path.GetFullPath(rootFolder)

    new(folder : string) = FolderBlobReader(folder, "")

    interface IBlobReader with
        member x.Read(n) = // TODO: Use lazy reading!!!
            let path = Path.Combine(fullPath, if String.IsNullOrEmpty(name) then n else name + "." + n)
            if not(File.Exists(path)) then failwith ("No file " + path + " is found")
            use dataStream = File.OpenRead(path)
            let length = int(dataStream.Length)
            let bytes = Array.zeroCreate<byte>(length)
            if dataStream.Read(bytes, 0, length) <> length then failwith ("Error reading file " + path)
            upcast InlineByteBlob(bytes)

        member x.GetGroup(groupName) = upcast FolderBlobReader((if String.IsNullOrEmpty(name) then fullPath else Path.Combine(fullPath, name)), groupName)

