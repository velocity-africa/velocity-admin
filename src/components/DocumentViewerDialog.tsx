import { Close as CloseIcon } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  documentUrl: string;
  title: string;
}

function isPdfUrl(url: string): boolean {
  // Check if the URL contains .pdf before any query parameters
  const urlWithoutParams = url.split('?')[0];
  return urlWithoutParams.toLowerCase().endsWith('.pdf');
}

export default function DocumentViewerDialog({
  open,
  onClose,
  documentUrl,
  title,
}: DocumentViewerDialogProps) {
  const isPdf = isPdfUrl(documentUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setImgLoaded(false);
  }, [documentUrl, open]);

  function handleImgError() {
    setError("Failed to load image.");
    setImgLoaded(false);
    setIsLoading(false);
  }

  function handleImgLoad() {
    setImgLoaded(true);
    setIsLoading(false);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "90vh" } }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        {error ? (
          <Box sx={{ p: 4, color: "error.main", textAlign: "center" }}>
            <Typography variant="body1">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
              URL: {documentUrl}
            </Typography>
          </Box>
        ) : isPdf ? (
          <Box
            component="iframe"
            src={documentUrl}
            sx={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            {isLoading && !imgLoaded && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <Box
              component="img"
              src={documentUrl}
              alt={title}
              onError={handleImgError}
              onLoad={handleImgLoad}
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                display: imgLoaded ? "block" : "none",
              }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
