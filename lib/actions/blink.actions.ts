"use server";

import { revalidatePath } from "next/cache";
import Blink from "../models/blink.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createBlink({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdBlink = await Blink.create({
      text,
      author,
      community: null,
    });

    // Update User Model
    await User.findByIdAndUpdate(author, {
      $push: { blinks: createdBlink._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating blink: ${error.message}`);
  }
}

export async function fetchBlinks(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of blinks to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch only those blinks that have no parents i.e. top-level blinks
  const blinksQuery = Blink.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalBlinksCount = await Blink.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const blinks = await blinksQuery.exec();

  const isNext = totalBlinksCount > skipAmount + blinks.length;

  return { blinks, isNext };
}

export async function fetchBlinkById(id: string) {
  connectToDB();

  try {
    const blink = await Blink.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate([
        {
          path: "children",
          populate: {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
        },
        {
          path: "children",
          model: "Blink",
          populate: {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
        },
      ])
      .exec();

    return blink;
  } catch (error: any) {
    throw new Error(`Error fetching blink: ${error.message}`);
  }
}

export async function addCommentToBlink(
  blinkId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    const originalBlink = await Blink.findById(blinkId);

    if (!originalBlink) {
      throw new Error("Blink not found");
    }

    const commentBlink = new Blink({
      text: commentText,
      author: userId,
      parentId: blinkId,
    });
    const savedCommentBlink = await commentBlink.save();

    originalBlink.children.push(savedCommentBlink._id);

    await originalBlink.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment: ${error.message}`);
  }
}
