"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, notify, Label, DateTimePicker } from "@project-organizer/ui";
import { createHackathon, updateHackathon } from "../../actions/hackathons";
import Image from "next/image";

export default function HackathonForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const res = isEditing 
      ? await updateHackathon(initialData.id, formData)
      : await createHackathon(formData);
      
    setLoading(false);

    if (res.success) {
      notify.success(`Hackathon ${isEditing ? 'updated' : 'created'} successfully`);
      router.push(`/hackathons`);
    } else {
      notify.error(res.error || `Failed to ${isEditing ? 'update' : 'create'} hackathon`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Hackathon Name</Label>
        <Input id="name" name="name" required defaultValue={initialData?.name} placeholder="e.g. Ignite Tech Fest" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" name="slug" required defaultValue={initialData?.slug} placeholder="e.g. ignite-tech-fest" disabled={isEditing} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="imageFile">Upload Hackathon Poster {isEditing && "(Leave empty to keep current)"}</Label>
          <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
          {isEditing && initialData?.imageUrl && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <span>Current:</span>
              <img src={initialData.imageUrl} alt="Poster" className="w-10 h-10 object-cover rounded-md" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Or Image URL</Label>
          <Input id="imageUrl" name="imageUrl" defaultValue={initialData?.imageUrl} placeholder="e.g. https://example.com/poster.jpg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startAt">Start Date & Time</Label>
          <DateTimePicker id="startAt" name="startAt" required defaultValue={initialData?.startAt ? new Date(initialData.startAt) : undefined} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endAt">End Date & Time</Label>
          <DateTimePicker id="endAt" name="endAt" required defaultValue={initialData?.endAt ? new Date(initialData.endAt) : undefined} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prizePool">Prize Pool</Label>
          <Input id="prizePool" name="prizePool" defaultValue={initialData?.settings?.metadata?.prizePool} placeholder="e.g. ₹50K+" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hackersCount">Expected Hackers</Label>
          <Input id="hackersCount" name="hackersCount" defaultValue={initialData?.settings?.metadata?.hackersCount} placeholder="e.g. 500+" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codingHours">Hours of Coding</Label>
          <Input id="codingHours" name="codingHours" defaultValue={initialData?.settings?.metadata?.codingHours} placeholder="e.g. 24" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Tagline / Summary</Label>
        <Input id="summary" name="summary" defaultValue={initialData?.summary} placeholder="e.g. 24 hours of non-stop innovation" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="innerImageFile">Upload Inner/About Section Image {isEditing && "(Leave empty to keep current)"}</Label>
        <Input id="innerImageFile" name="innerImageFile" type="file" accept="image/*" />
        <p className="text-xs text-muted-foreground">This image is displayed inside the About section of the landing page.</p>
        {isEditing && initialData?.settings?.metadata?.innerImageUrl && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
            <span>Current:</span>
            <img src={initialData.settings.metadata.innerImageUrl} alt="Inner" className="w-10 h-10 object-cover rounded-md" />
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-500 text-white border-orange-500">
          {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Hackathon" : "Launch Hackathon")}
        </Button>
      </div>
    </form>
  );
}
