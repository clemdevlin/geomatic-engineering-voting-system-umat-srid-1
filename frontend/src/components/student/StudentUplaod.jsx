import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { FileIcon, Loader, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner"; // or your toast system
import { CardDescription } from "../ui/card";

const StudentUpload = ({ API, user }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(`${API}/admin/students/upload`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("Upload response:", res.data);

      toast.success(res.data.message || "Upload successful!");
      setFile(null);
      window.location.reload();
    } catch (err) {
      console.error("error uploading", err);
      toast.error(err.response?.data?.detail || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-16 flex flex-col gap-2"
          variant="outline"
          disabled={loading}
        >
          <Upload className="h-6 w-6" />
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader />
              Uploading...
            </div>
          ) : (
            "Upload Students"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Students</DialogTitle>
        </DialogHeader>
        <CardDescription>
          Upload a CSV file containing student details. The CSV should have the
          following headers: <code>index_number</code>, <code>surname</code>,
          and <code>reference_number</code>.
        </CardDescription>

        {/* Dropzone-like area */}
        <div
          onClick={handleClick}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-primary transition"
        >
          {!file ? (
            <p className="text-sm text-gray-500">Click to select a CSV file</p>
          ) : (
            <div className="flex items-center gap-2 text-gray-700">
              <FileIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setFile(null)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentUpload;
