import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiClient from "@/lib/api";
import { toast } from "sonner";

interface CreateTargetListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactIds: string[];
  contactCount: number;
}

export function CreateTargetListModal({
  open,
  onOpenChange,
  contactIds,
  contactCount,
}: CreateTargetListModalProps) {
  const [listName, setListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setListName("");
      setCreatingList(false);
    }
  }, [open]);

  const handleCreate = async () => {
    if (!listName.trim()) {
      toast.error("List name is required", {
        description: "Please enter a name for the target list",
      });
      return;
    }

    if (contactIds.length === 0) {
      toast.error("No contacts to add", {
        description: "There are no contacts in the current results",
      });
      return;
    }

    setCreatingList(true);
    try {
      const response = await apiClient.post(
        "/Api/V8/custom/customer/create-target-list-from-contacts",
        {
          data: {
            targetlist_name: listName.trim(),
            contact_ids: contactIds,
          },
        }
      );

      toast.success("Target list created successfully", {
        description: `Created "${listName}" with ${contactIds.length} contacts`,
      });

      // Close modal and reset form
      onOpenChange(false);
      setListName("");
    } catch (error: any) {
      console.error("Error creating target list:", error);
      toast.error("Failed to create target list", {
        description:
          error.response?.data?.message || error.message || "An error occurred",
      });
    } finally {
      setCreatingList(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setListName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Target List</DialogTitle>
          <DialogDescription>
            Create a new target list from the filtered results. This will include{" "}
            {contactCount} contact{contactCount !== 1 ? "s" : ""} from the current
            page.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="list-name">List Name</Label>
            <Input
              id="list-name"
              placeholder="Enter target list name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && listName.trim() && !creatingList) {
                  handleCreate();
                }
              }}
              disabled={creatingList}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={creatingList}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!listName.trim() || creatingList}
            className="btn-gradient"
          >
            {creatingList ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              "OK"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

