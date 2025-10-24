import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  readTime: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}
interface BlogState {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  singleStatus: "idle" | "loading" | "succeeded" | "failed";
  actionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BlogState = {
  posts: [],
  selectedPost: null,
  listStatus: "idle",
  singleStatus: "idle",
  actionStatus: "idle",
  error: null,
};
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/blogs`;
const getToken = (state: RootState) => state.user.userInfo?.token;

export const fetchAllBlogs = createAsyncThunk<BlogPost[]>(
  "blogs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);
export const fetchBlogBySlug = createAsyncThunk<BlogPost, string>(
  "blogs/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${slug}`);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Blog post not found"
      );
    }
  }
);

export const addBlogPost = createAsyncThunk<
  BlogPost,
  Partial<Omit<BlogPost, "_id" | "slug" | "author" | "createdAt">>,
  { state: RootState }
>("blogs/add", async (blogData, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    if (!token) throw new Error("Not authorized, no token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.post(API_URL, blogData, config);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add blog post"
    );
  }
});

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearSelectedPost: (state) => {
      state.selectedPost = null;
      state.singleStatus = "idle";
    },
    resetActionStatus: (state) => {
      state.actionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.singleStatus = "loading";
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.singleStatus = "succeeded";
        state.selectedPost = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.singleStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(addBlogPost.pending, (state) => {
        state.actionStatus = "loading";
      })
      .addCase(addBlogPost.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        state.posts.unshift(action.payload);
      })
      .addCase(addBlogPost.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload as string;
      });
  },
});
export const { clearSelectedPost, resetActionStatus } = blogSlice.actions;
export default blogSlice.reducer;