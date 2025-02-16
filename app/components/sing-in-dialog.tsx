import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import Image from "next/image"

const SignInDialog = () => {
  const handleLoginWithGoogleClick = () => signIn("google")
  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription>
          Entre com um email ou utilizando outra conta
        </DialogDescription>
      </DialogHeader>

      <Input placeholder="email" />
      <Input placeholder="senha" />

      <Button variant="outline" className="gap-1 bg-blue-400 font-bold">
        Login
      </Button>

      <div className="flex items-center">
        <div className="h-[1px] flex-grow bg-gray-400"></div>
        <span className="p-4 text-gray-400">ou</span>
        <div className="h-[1px] flex-grow bg-gray-400"></div>
      </div>

      <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={handleLoginWithGoogleClick}
      >
        <Image
          alt="Fazer login com Google"
          src="/google.svg"
          width={18}
          height={18}
        />
        Google
      </Button>
      {/* <Button
        variant="outline"
        className="gap-1 font-bold"
        onClick={handleLoginWithFacebookClick}
      >
        <Image
          alt="Fazer login com Facebook"
          src="/facebook.png"
          width={18}
          height={18}
        />
        FaceBook
      </Button> */}
    </>
  )
}

export default SignInDialog
