import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function GlobalDialog({ children, title , description , action , confirmText }: { children: React.ReactNode , title: string , description: string , action: () => void , confirmText: string }) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">{children}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={action}>{confirmText}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
