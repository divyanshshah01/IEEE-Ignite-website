"use server";

import { db } from "@project-organizer/sdk";
import { Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client for Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getHackathons(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}) {
  try {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: Prisma.EventWhereInput = {
      isDeleted: false,
      // Hackathons are events that have hackathonTracks
      hackathonTracks: {
        some: {}
      }
    };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { slug: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          organization: true,
          _count: {
            select: { hackathonTracks: true, teams: true, registrations: true }
          }
        }
      }),
      db.event.count({ where }),
    ]);

    // If there are no hackathons explicitly using the hackathonTracks relation yet,
    // fallback to querying all events as hackathons if it's a dev environment.
    let fallbackEvents = events;
    let fallbackTotal = total;
    if (total === 0) {
       const [allEvents, allTotal] = await Promise.all([
          db.event.findMany({
            where: { isDeleted: false, ...(params.search ? { OR: [{ name: { contains: params.search, mode: "insensitive" } }] } : {}) },
            skip,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            include: {
              organization: true,
              _count: {
                select: { hackathonTracks: true, teams: true, registrations: true }
              }
            }
          }),
          db.event.count({ where: { isDeleted: false } })
       ]);
       fallbackEvents = allEvents;
       fallbackTotal = allTotal;
    }

    return {
      success: true,
      data: {
        hackathons: fallbackEvents.map((evt) => ({
          id: evt.id,
          name: evt.name,
          organization: evt.organization.name,
          state: evt.state,
          tracksCount: evt._count.hackathonTracks,
          teamsCount: evt._count.teams,
          registrationsCount: evt._count.registrations,
          startAt: evt.startAt.toISOString(),
        })),
        total: fallbackTotal,
        pageCount: Math.ceil(fallbackTotal / pageSize),
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch hackathons:", error);
    return {
      success: false,
      error: "Failed to load hackathons",
    };
  }
}

export async function createHackathon(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      startAt: formData.get("startAt") as string,
      endAt: formData.get("endAt") as string,
      summary: formData.get("summary") as string,
    };
    const imageFile = formData.get("imageFile") as File | null;
    let imageUrl = formData.get("imageUrl") as string | null;
    
    // New fields
    const prizePool = formData.get("prizePool") as string;
    const hackersCount = formData.get("hackersCount") as string;
    const codingHours = formData.get("codingHours") as string;
    const innerImageFile = formData.get("innerImageFile") as File | null;
    let innerImageUrl: string | null = null;

    // Handle Main Image Upload to Supabase Storage
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${data.slug}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('event')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error("Failed to upload image: " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage.from('event').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    // Handle Inner Image Upload
    if (innerImageFile && innerImageFile.size > 0) {
      const fileExt = innerImageFile.name.split('.').pop();
      const fileName = `${data.slug}-inner-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('event')
        .upload(fileName, innerImageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error("Failed to upload inner image: " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage.from('event').getPublicUrl(fileName);
      innerImageUrl = publicUrlData.publicUrl;
    }

    const org = await db.organization.findFirst();
    if (!org) throw new Error("No organization found");
    const admin = await db.user.findFirst();
    
    // Find or Create Hackathon Category specifically
    let category = await db.eventCategory.findFirst({
      where: { name: { equals: "Hackathon", mode: "insensitive" } }
    });

    if (!category) {
      category = await db.eventCategory.create({
        data: {
          name: "Hackathon",
          slug: "hackathon",
          organizationId: org.id,
        }
      });
    }

    const event = await db.event.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: category.id,
        imageUrl: imageUrl,
        startAt: new Date(data.startAt).toISOString(),
        endAt: new Date(data.endAt).toISOString(),
        summary: data.summary,
        state: "PUBLISHED",
        visibility: "PUBLIC",
        organizationId: org.id,
        createdBy: admin?.id || undefined,
        settings: { 
          create: { 
            allowTeams: true,
            metadata: {
              prizePool,
              hackersCount,
              codingHours,
              innerImageUrl
            }
          } 
        },
      },
    });
    
    await db.eventTimeline.create({
      data: {
        eventId: event.id,
        action: "HACKATHON_CREATED",
        message: "Hackathon was created in Draft state",
        actorId: admin?.id || undefined,
      }
    });

    return { success: true, data: event.id };
  } catch (error: any) {
    console.error("Failed to create hackathon:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "A Hackathon with this Slug already exists." };
    }
    return { success: false, error: error.message || "Failed to create hackathon" };
  }
}

export async function updateHackathon(id: string, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      startAt: formData.get("startAt") as string,
      endAt: formData.get("endAt") as string,
      summary: formData.get("summary") as string,
    };
    const imageFile = formData.get("imageFile") as File | null;
    let imageUrl = formData.get("imageUrl") as string | null;
    
    // New fields
    const prizePool = formData.get("prizePool") as string;
    const hackersCount = formData.get("hackersCount") as string;
    const codingHours = formData.get("codingHours") as string;
    const innerImageFile = formData.get("innerImageFile") as File | null;
    let innerImageUrl: string | null = null;

    // Handle Main Image Upload to Supabase Storage
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${data.slug}-edit-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('event')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error("Failed to upload image: " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage.from('event').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    // Handle Inner Image Upload
    if (innerImageFile && innerImageFile.size > 0) {
      const fileExt = innerImageFile.name.split('.').pop();
      const fileName = `${data.slug}-inner-edit-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('event')
        .upload(fileName, innerImageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error("Failed to upload inner image: " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage.from('event').getPublicUrl(fileName);
      innerImageUrl = publicUrlData.publicUrl;
    }

    const eventToUpdate = await db.event.findUnique({
      where: { id },
      include: { settings: true }
    });
    
    if (!eventToUpdate) throw new Error("Hackathon not found");

    const updateData: any = {
      name: data.name,
      slug: data.slug,
      startAt: new Date(data.startAt).toISOString(),
      endAt: new Date(data.endAt).toISOString(),
      summary: data.summary,
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const currentMetadata = (eventToUpdate.settings?.metadata as any) || {};
    const newMetadata = {
      ...currentMetadata,
      prizePool,
      hackersCount,
      codingHours,
    };
    if (innerImageUrl) {
      newMetadata.innerImageUrl = innerImageUrl;
    }

    const event = await db.event.update({
      where: { id },
      data: {
        ...updateData,
        settings: {
          update: {
            metadata: newMetadata
          }
        }
      }
    });

    return { success: true, data: event.id };
  } catch (error: any) {
    console.error("Failed to update hackathon:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "A Hackathon with this Slug already exists." };
    }
    return { success: false, error: error.message || "Failed to update hackathon" };
  }
}

