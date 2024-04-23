export type CkanResponse = {
  help:    string;
  success: boolean;
  result:  CkanResult;
}

export type CkanResult = {
  license_title:            string;
  maintainer:               string;
  relationships_as_object:  any[];
  private:                  boolean;
  maintainer_email:         string;
  num_tags:                 number;
  id:                       string;
  metadata_created:         Date;
  metadata_modified:        Date;
  author:                   string;
  author_email:             string;
  state:                    "active" | string;
  version:                  string;
  creator_user_id:          string;
  type:                     string;
  resources:                CkanResource[];
  num_resources:            number;
  tags:                     Tag[];
  tracking_summary:         TrackingSummary;
  groups:                   Group[];
  license_id:               string;
  relationships_as_subject: any[];
  organization:             Organization;
  name:                     string;
  isopen:                   boolean;
  url:                      string;
  notes:                    string;
  owner_org:                string;
  extras:                   any[];
  license_url:              string;
  title:                    string;
  revision_id:              string;
}

export type Group = {
  display_name:      string;
  description:       string;
  image_display_url: string;
  title:             string;
  id:                string;
  name:              string;
}

export type Organization = {
  description:     string;
  created:         Date;
  title:           string;
  name:            string;
  is_organization: boolean;
  state:           "active" | string;
  image_url:       string;
  revision_id:     string;
  type:            string;
  id:              string;
  approval_status: string;
}

export type CkanResource = {
  cache_last_updated:                            null;
  package_id:                                    string;
  datastore_contains_all_records_of_source_file: boolean;
  datastore_active:                              boolean;
  id:                                            string;
  size:                                          number;
  original_url:                                  string;
  resource_id:                                   string;
  set_url_type:                                  IgnoreHash;
  state:                                         "active" | string;
  ignore_hash:                                   IgnoreHash;
  hash:                                          string;
  description:                                   string;
  format:                                        Format;
  tracking_summary:                              TrackingSummary;
  mimetype_inner:                                null;
  url_type:                                      URLType;
  mimetype:                                      Mimetype;
  cache_url:                                     null;
  name:                                          string;
  created:                                       Date;
  url:                                           string;
  ckan_url:                                      string;
  task_created:                                  Date;
  last_modified:                                 Date;
  position:                                      number;
  revision_id:                                   string;
  resource_type:                                 null;
}

export enum Format {
  CSV = "CSV",
}

export enum IgnoreHash {
  False = "False",
}

export enum Mimetype {
  TextCSV = "text/csv",
}

export type TrackingSummary = {
  total:  number;
  recent: number;
}

export enum URLType {
  Upload = "upload",
}

export type Tag = {
  vocabulary_id: null;
  state:         "active" | string;
  display_name:  string;
  id:            string;
  name:          string;
}
