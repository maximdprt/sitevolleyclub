"use client";

import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/upload";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
