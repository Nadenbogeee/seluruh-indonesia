"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Eye, Trash2, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

interface PageInfo {
  last_page: number;
}

interface ApiResponse {
  meta: {
    success: boolean;
    message?: string;
  };
  data:
    | {
        articles: Article[];
        page_info: PageInfo;
      }
    | Article;
  errors?: FormErrors;
}

const Home = () => {
  const [currentView, setCurrentView] = useState("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletConfirmation, setDeleteConfirmation] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api-trials.x5.com.au/api/articles?search=${searchQuery}&page=${currentPage}&page_size=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );
      const data = (await response.json()) as ApiResponse;
      if (data.meta.success && "articles" in data.data) {
        setArticles(data.data.articles);
        setTotalPages(data.data.page_info.last_page);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
    setLoading(false);
  }, [searchQuery, currentPage, pageSize]);

  const fetchArticleById = async (id: number) => {
    try {
      const response = await fetch(
        `https://api-trials.x5.com.au/api/articles/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );
      const data = (await response.json()) as ApiResponse;
      if (data.meta.success && !("articles" in data.data)) {
        setSelectedArticle(data.data as Article);
        setCurrentView("detail");
      }
    } catch (error) {
      console.error("Error fetching article details:", error);
    }
  };

  const deleteArticle = async (id: number) => {
    setDeleteConfirmation(true);
    if (deletConfirmation === true) return;

    setIsDeleting(true);
    setTimeout(() => setSubmitMessage({ type: "", text: "" }), 3000);

    try {
      const response = await fetch(
        `https://api-trials.x5.com.au/api/articles/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );
      const data = (await response.json()) as ApiResponse;
      if (data.meta.success) {
        fetchArticles(); // Refresh the list
        setSubmitMessage({
          type: "success",
          text: "Article deleted successfully!",
        });
        // Clear message after 3 seconds
        setTimeout(() => setSubmitMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      setSubmitMessage({
        type: "error",
        text: "Failed to delete article.",
      });
      setTimeout(() => setSubmitMessage({ type: "", text: "" }), 3000);
    } finally {
      setDeleteConfirmation(false);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!content.trim()) errors.content = "Content is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const url = selectedArticle
        ? `https://api-trials.x5.com.au/api/articles/${selectedArticle.id}`
        : "https://api-trials.x5.com.au/api/articles";

      const method = selectedArticle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (data.meta.success) {
        setTitle("");
        setContent("");
        setFormErrors({});
        setSelectedArticle(null);
        setCurrentView("list");
        fetchArticles();
        setSubmitMessage({
          type: "success",
          text: `Article ${selectedArticle ? "updated" : "created"} successfully!`,
        });
      } else {
        const errorMessage =
          data.meta?.message ||
          `Failed to ${selectedArticle ? "update" : "create"} article`;
        setSubmitMessage({
          type: "error",
          text: errorMessage,
        });

        if (data.errors) {
          setFormErrors(data.errors);
        }
      }
    } catch (error) {
      console.error(
        `Error ${selectedArticle ? "updating" : "creating"} article:`,
        error,
      );
      setSubmitMessage({
        type: "error",
        text: `Failed to ${selectedArticle ? "update" : "create"} article. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage({ type: "", text: "" }), 3000);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setFormErrors({});
    setSubmitMessage({ type: "", text: "" });
  };

  const DetailView = () => (
    <div className="p-4">
      <button
        onClick={() => setCurrentView("list")}
        className="mb-4 inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to List
      </button>

      {selectedArticle && (
        <>
          <div className="mb-4">
            <h3 className="font-semibold">Title</h3>
            <p className="mt-2">{selectedArticle.title}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Content</h3>
            <p className="mt-2">{selectedArticle.content}</p>
          </div>
          <div>
            <h3 className="font-semibold">Created At</h3>
            <p className="mt-2">{formatDate(selectedArticle.created_at)}</p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 border-b">
          <div className="flex gap-6">
            <button
              onClick={() => {
                resetForm();
                setCurrentView("list");
              }}
              className={`flex w-[17vw] pb-2 ${currentView === "list" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            >
              <Image
                src={
                  currentView === "list"
                    ? "/articleList-active.png"
                    : "/articleList-unactive.png"
                }
                alt="Button"
                height={50}
                width={50}
              />
              <div className="flex flex-col">
                <p>Article</p>
                <span className="ml-2 text-sm">List Article</span>
              </div>
            </button>
            <button
              onClick={() => {
                resetForm();
                setCurrentView("form");
              }}
              className={`flex w-[17vw] pb-2 ${currentView === "form" || currentView === "edit" ? "border-b-2 border-green-500 text-green-500" : "text-gray-500"}`}
            >
              <Image
                src={
                  currentView === "form" || currentView === "edit"
                    ? "/addEditArticle-active.png"
                    : "/addEditArticle-unactive.png"
                }
                alt="Button"
                height={50}
                width={50}
              />
              <div className="flex flex-col">
                <p>Add / Edit</p>
                <span className="ml-2 text-sm">Detail Article</span>
              </div>
            </button>
          </div>
        </div>

        {currentView === "list" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <input
                type="text"
                placeholder="Type here to search"
                className="rounded-lg border p-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-4">
                <select className="rounded-lg border p-2 text-sm">
                  <option>2023</option>
                </select>
                <button
                  onClick={() => {
                    resetForm();
                    setCurrentView("form");
                  }}
                  className="rounded-lg bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>

            {submitMessage.text && (
              <div
                className={`mb-4 rounded-lg p-3 ${
                  submitMessage.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm">
                    <th className="p-3">No</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Content</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : articles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        No articles found
                      </td>
                    </tr>
                  ) : (
                    articles.map((article, index) => (
                      <tr key={article.id} className="border-b text-sm">
                        <td className="p-3">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="p-3">
                          {formatDate(article.created_at)}
                        </td>
                        <td className="p-3">{article.title}</td>
                        <td className="p-3">{article.content}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => fetchArticleById(article.id)}
                              className="rounded-full bg-green-100 p-2 text-green-600 hover:bg-yellow-200"
                              aria-label="View article"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setTitle(article.title);
                                setContent(article.content);
                                setSelectedArticle(article);
                                setCurrentView("edit");
                              }}
                              className="rounded-full bg-yellow-100 p-2 text-yellow-600 hover:bg-yellow-200"
                              aria-label="Edit article"
                            >
                              <Pencil size={16} />
                            </button>
                            {/*  */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  // onClick={() => deleteArticle(article.id)}
                                  className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                                  // aria-label="Delete article"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle className="flex gap-5">
                                    <Trash2 size={16} /> Delete Article
                                  </DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete it? You
                                    can’t undo this action.
                                  </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                  <Button type="submit" variant="secondary">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => deleteArticle(article.id)}
                                    variant="destructive"
                                  >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {/*  */}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show</span>
                <select
                  className="rounded border p-1 text-sm"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                <span className="text-sm text-gray-500">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`rounded-lg border p-2 ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"}`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-3 py-1 ${
                        currentPage === page
                          ? "bg-green-500 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  className={`rounded-lg border p-2 ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"}`}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
        {currentView === "detail" && <DetailView />}
        {currentView === "edit" && (
          <form className="p-4" onSubmit={handleSubmit}>
            <button
              onClick={() => setCurrentView("list")}
              className="mb-4 inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to List
            </button>
            <h1 className="mb-[3vh] text-[2vw] font-medium">Edit Article</h1>
            {submitMessage.text && (
              <div
                className={`mb-4 rounded-lg p-3 ${
                  submitMessage.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="title" className="mb-2 block font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-lg border ${
                  formErrors.title ? "border-red-500 bg-red-50" : "bg-gray-50"
                } p-3`}
                placeholder="Enter title"
                disabled={isSubmitting}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="mb-2 block font-medium">
                Content
              </label>
              <textarea
                id="content"
                className={`h-32 w-full rounded-lg border ${
                  formErrors.content ? "border-red-500 bg-red-50" : "bg-gray-50"
                } p-3`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                disabled={isSubmitting}
              />
              {formErrors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.content}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                className={`rounded-lg px-6 py-2 text-white ${
                  isSubmitting
                    ? "cursor-not-allowed bg-green-300"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setCurrentView("list");
                }}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {/* tambah page */}
        {currentView === "form" && (
          <form className="p-4" onSubmit={handleSubmit}>
            {submitMessage.text && (
              <div
                className={`mb-4 rounded-lg p-3 ${
                  submitMessage.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="title" className="mb-2 block font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-lg border ${
                  formErrors.title ? "border-red-500 bg-red-50" : "bg-gray-50"
                } p-3`}
                placeholder="Enter title"
                disabled={isSubmitting}
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="mb-2 block font-medium">
                Content
              </label>
              <textarea
                id="content"
                className={`h-32 w-full rounded-lg border ${
                  formErrors.content ? "border-red-500 bg-red-50" : "bg-gray-50"
                } p-3`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content"
                disabled={isSubmitting}
              />
              {formErrors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.content}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                className={`rounded-lg px-6 py-2 text-white ${
                  isSubmitting
                    ? "cursor-not-allowed bg-green-300"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setCurrentView("list");
                }}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Home;
