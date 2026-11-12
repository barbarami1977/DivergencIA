CREATE TABLE public_counts (
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('visit', 'open', 'download')),
  total INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (resource, action)
);
