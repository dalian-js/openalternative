"use client"

import type { Category } from "@openalternative/db"
import type { Row } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { deleteCategories } from "../_lib/actions"

interface DeleteCategoriesDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  categories: Row<Category>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export const DeleteCategoriesDialog = ({
  categories,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCategoriesDialogProps) => {
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  const onDelete = () => {
    startDeleteTransition(async () => {
      const { error } = await deleteCategories({
        ids: categories.map(({ id }) => id),
      })

      if (error) {
        toast.error(error)
        return
      }

      props.onOpenChange?.(false)
      toast.success("Categories deleted")
      onSuccess?.()
    })
  }

  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="max-sm:mr-2" aria-hidden="true" />
            Delete ({categories.length})
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">{categories.length}</span>
            {categories.length === 1 ? " category" : " categories"} from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            isPending={isDeletePending}
            disabled={isDeletePending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
