import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const CaseFileStatus_3 = z.enum(["OPEN", "CLOSE"]);
const filter = z
  .object({
    id: z.array(z.string().uuid()).nullable(),
    code: z.string().nullable(),
    title: z.string().nullable(),
    category: z.array(z.string()).nullable(),
    owner: z.array(z.string()).nullable(),
    status: CaseFileStatus_3.nullable(),
    createdFrom: z.string().datetime({ offset: true }).nullable(),
    createdUntil: z.string().datetime({ offset: true }).nullable(),
    metadata: z.record(z.string()).and(z.unknown()).nullable(),
    page: z.number().int().nullable(),
    size: z.number().int().nullable(),
    sort: z.array(z.string()).nullable(),
  })
  .partial()
  .passthrough();
const CaseFileStatus_1 = z.enum(["OPEN", "CLOSE"]);
const SearchCaseFileViewModel = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    code: z.string(),
    category: z.string(),
    owner: z.string(),
    status: CaseFileStatus_1.and(z.string()),
    createdAt: z.string().datetime({ offset: true }),
    metadata: z.record(z.string()).and(z.unknown()),
  })
  .partial()
  .passthrough();
const Metadata = z
  .object({
    currentPage: z.number().int(),
    totalPages: z.number().int(),
    pageSize: z.number().int(),
    totalRecords: z.number().int(),
  })
  .partial()
  .passthrough();
const BaseCollectionViewModel_SearchCaseFileViewModel_ = z
  .object({ records: z.array(SearchCaseFileViewModel), _metadata: Metadata })
  .partial()
  .passthrough();
const SearchCaseFileCollectionViewModel =
  BaseCollectionViewModel_SearchCaseFileViewModel_.and(
    z
      .object({ records: z.array(SearchCaseFileViewModel) })
      .partial()
      .passthrough()
  );
const CreateCaseFileRequestModel = z
  .object({
    id: z.string().uuid(),
    code: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    owner: z.string().optional(),
    title: z.string().optional(),
    metadata: z.record(z.string()).and(z.unknown()).optional(),
  })
  .passthrough();
const BulkPatchOperation = z.enum(["REPLACE", "REMOVE"]);
const BulkPatchOperationRequestModel = z
  .object({
    operation: BulkPatchOperation,
    path: z.string(),
    value: z.string().optional(),
  })
  .passthrough();
const BulkPatchRequestModel = z
  .object({
    ids: z.array(z.string()).min(1),
    patch: z.array(BulkPatchOperationRequestModel).optional(),
  })
  .passthrough();
const CaseFileStatus = z.enum(["OPEN", "CLOSE"]);
const GetCaseFileViewModel = z
  .object({
    id: z.string().uuid(),
    code: z.string(),
    description: z.string(),
    category: z.string(),
    owner: z.string(),
    status: CaseFileStatus.and(z.string()),
    metadata: z.record(z.string()).and(z.unknown()),
    groups: z.string(),
    title: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const UpdateCaseFileRequestModel = z
  .object({
    code: z.string(),
    description: z.string(),
    category: z.string(),
    owner: z.string(),
    title: z.string(),
    metadata: z.record(z.string()),
  })
  .partial()
  .passthrough();
const GroupType = z.enum(["FILE", "PHOTO", "VIDEO", "WEB_PLUGIN"]);
const CreateEvidenceGroupRequestModel = z
  .object({
    id: z.string().uuid(),
    code: z.string().max(50).optional(),
    type: GroupType,
    name: z.string().max(255).optional(),
    description: z.string().max(255).optional(),
    createdBy: z.string().max(50).optional(),
    metadata: z.record(z.string()).and(z.unknown()).optional(),
  })
  .passthrough();
const EvidenceGroupStatus = z.enum(["OPEN", "CLOSING", "CLOSED"]);
const EvidencesCountViewModel = z
  .object({
    total: z.number().int(),
    inProcess: z.number().int(),
    failed: z.number().int(),
    completed: z.number().int(),
  })
  .partial()
  .passthrough();
const EvidenceGroupViewModel = z
  .object({
    id: z.string().uuid(),
    caseFileId: z.string().uuid(),
    collectionMetadataId: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    type: z.string(),
    status: EvidenceGroupStatus,
    description: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    createdBy: z.string(),
    evidences: EvidencesCountViewModel,
    discarded: z.boolean(),
    metadata: z.record(z.string()).and(z.unknown()),
  })
  .partial()
  .passthrough();
const UpdateEvidenceGroupRequest = z
  .object({
    name: z.string().max(255),
    description: z.string().max(255),
    code: z.string().max(50),
    createdBy: z.string().max(50),
    metadata: z.record(z.string()),
  })
  .partial()
  .passthrough();
const CloseEvidenceGroupRequestModel = z
  .object({
    evidencesCount: z.number().int(),
    collectMetadata: z.record(z.string()).and(z.unknown()).optional(),
  })
  .passthrough();
const CustodyType = z.enum(["INTERNAL", "EXTERNAL"]);
const TestimonyProviders = z
  .object({ required: z.boolean(), providers: z.array(z.string()) })
  .partial()
  .passthrough();
const RegisterEvidenceRequestModel = z
  .object({
    evidenceId: z.string().uuid(),
    hash: z
      .string()
      .min(1)
      .regex(/^([a-f0-9]{64})$/),
    createdBy: z.string().max(50).optional(),
    title: z.string().optional(),
    type: z.string().optional(),
    capturedAt: z.string().datetime({ offset: true }),
    custodyType: CustodyType,
    fileName: z.string().optional(),
    fileSize: z.number().int().optional(),
    testimony: z
      .object({ TSP: TestimonyProviders, DLT: TestimonyProviders })
      .partial()
      .passthrough()
      .and(z.unknown()),
    requiredTestimonyProviders: z.array(z.string()),
    metadata: z.record(z.string()).and(z.unknown()).optional(),
  })
  .passthrough();
const RegisterEvidenceResponseModel = z
  .object({
    url: z.string(),
    expiration: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const GetEvidenceStatusViewModel = z
  .object({
    status: z.string(),
    tspTimestamp: z.record(z.string()).and(z.unknown()),
    dltTimestamp: z.record(z.string()).and(z.unknown()),
    file: z.string(),
  })
  .partial()
  .passthrough();
const TspTimestampViewModel = z
  .object({
    token: z.string(),
    timestampedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const DltTimestampViewModel = z
  .object({
    blockHash: z.string(),
    transactionHash: z.string(),
    network: z.string(),
    blockExplorerLink: z.string(),
    timestampedAt: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const GetEvidenceTimestampsViewModel = z
  .object({
    tspTimestamps: z.record(TspTimestampViewModel),
    dltTimestamps: z.record(DltTimestampViewModel),
  })
  .partial()
  .passthrough();
const GetEvidenceViewModel = z
  .object({
    caseFileId: z.string().uuid(),
    groupId: z.string().uuid(),
    evidenceId: z.string().uuid(),
    title: z.string(),
    custodyType: z.string(),
    status: GetEvidenceStatusViewModel,
    capturedAt: z.string().datetime({ offset: true }),
    fileName: z.string(),
    fileSize: z.number().int(),
    hash: z.string(),
    timestamps: GetEvidenceTimestampsViewModel,
    createdBy: z.string(),
    metadata: z.record(z.string()).and(z.unknown()),
  })
  .partial()
  .passthrough();
const NewUploadUrlRequestModel = z
  .object({ fileName: z.string().min(1) })
  .passthrough();
const createUploadUrl_Body = z
  .object({ requestModel: NewUploadUrlRequestModel })
  .partial()
  .passthrough();
const ObjectType_1 = z.enum([
  "EVIDENCE",
  "REPORT",
  "REPORT_PACKAGE",
  "TEMPLATE",
]);
const DownloadUrlModel_1 = z
  .object({
    id: z.string().uuid(),
    type: ObjectType_1,
    url: z.string(),
    expiration: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const RelationshipItemType = z.literal("CHAT_CONVERSATION");
const AssignRelationshipRequestModel = z
  .object({ itemType: RelationshipItemType, itemValue: z.string() })
  .passthrough();
const EvidenceRequestModel = z
  .object({
    id: z.string().uuid(),
    title: z.string().optional(),
    metadata: z.record(z.string()).and(z.unknown()).optional(),
  })
  .passthrough();
const GroupRequestModel = z
  .object({
    id: z.string().uuid(),
    code: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    type: z.string().min(1),
    capturedFrom: z.string().datetime({ offset: true }),
    capturedUntil: z.string().datetime({ offset: true }),
    evidences: z.array(EvidenceRequestModel).min(1),
    metadata: z.record(z.string()).and(z.unknown()).optional(),
  })
  .passthrough();
const DataRequestModel = z
  .object({ groups: z.array(GroupRequestModel).min(1) })
  .partial()
  .passthrough();
const CaseFilePreviewReportRequestModel = z
  .object({
    template: z.string(),
    languageCode: z.string(),
    data: DataRequestModel.optional(),
    additionalData: z.object({}).partial().passthrough().optional(),
    metadata: z.record(z.string()).optional(),
  })
  .passthrough();
const CaseFileReportRequestModel = z
  .object({
    reportId: z.string().uuid(),
    filename: z.string().optional(),
    template: z.string(),
    languageCode: z.string(),
    data: DataRequestModel.optional(),
    additionalData: z
      .object({})
      .partial()
      .passthrough()
      .and(z.unknown())
      .optional(),
    metadata: z.record(z.string()).and(z.unknown()).optional(),
  })
  .passthrough();
const CaseFileStatusViewModel = z.enum(["OPEN", "CLOSE"]);
const UpdateCaseFileStatusRequestModel = z
  .object({ status: CaseFileStatusViewModel.and(z.string()) })
  .passthrough();
const ChatPreviewReportRequestModel = z
  .object({
    template: z.string(),
    languageCode: z.string(),
    fromDate: z.string().datetime({ offset: true }).nullish(),
    toDate: z.string().datetime({ offset: true }).nullish(),
    additionalData: z.object({}).partial().passthrough().optional(),
  })
  .passthrough();
const ChatSignedReportRequestModel = z
  .object({
    reportId: z.string().uuid(),
    filename: z.string().optional(),
    template: z.string(),
    languageCode: z.string(),
    fromDate: z.string().datetime({ offset: true }).nullish(),
    toDate: z.string().datetime({ offset: true }).nullish(),
    additionalData: z
      .object({})
      .partial()
      .passthrough()
      .and(z.unknown())
      .optional(),
  })
  .passthrough();
const filter__2 = z
  .object({
    caseFileId: z.string().uuid().nullable(),
    id: z.array(z.string().uuid()).nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    status: EvidenceGroupStatus.nullable(),
    type: GroupType.nullable(),
    createdBy: z.string().nullable(),
    metadata: z.record(z.string()).and(z.unknown()).nullable(),
    createdFrom: z.string().datetime({ offset: true }).nullable(),
    createdUntil: z.string().datetime({ offset: true }).nullable(),
    page: z.number().int().nullable(),
    size: z.number().int().nullable(),
    sort: z.array(z.string()).nullable(),
  })
  .partial()
  .passthrough();
const SearchEvidenceGroupViewModel = z
  .object({
    id: z.string().uuid(),
    groupId: z.string().uuid(),
    caseFileId: z.string().uuid(),
    collectionMetadataId: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    type: GroupType,
    status: EvidenceGroupStatus,
    createdBy: z.string(),
    discarded: z.boolean(),
    createdAt: z.string().datetime({ offset: true }),
    metadata: z.record(z.string()),
    evidences: EvidencesCountViewModel,
  })
  .partial()
  .passthrough();
const BaseCollectionViewModel_SearchEvidenceGroupViewModel_ = z
  .object({
    records: z.array(SearchEvidenceGroupViewModel),
    _metadata: Metadata,
  })
  .partial()
  .passthrough();
const SearchEvidenceGroupCollectionViewModel =
  BaseCollectionViewModel_SearchEvidenceGroupViewModel_.and(
    z
      .object({ records: z.array(SearchEvidenceGroupViewModel) })
      .partial()
      .passthrough()
  );
const TestimonyMode = z.enum(["TSP", "DLT"]);
const EvidenceStatus = z.enum(["ERROR", "IN_PROCESS", "COMPLETED"]);
const filter__3 = z
  .object({
    id: z.array(z.string().uuid()).nullable(),
    caseFileId: z.string().uuid().nullable(),
    groupId: z.array(z.string().uuid()).nullable(),
    groupType: z.array(GroupType).nullable(),
    title: z.string().nullable(),
    type: z.string(),
    hash: z.string().nullable(),
    custodyType: CustodyType.nullable(),
    testimonyMode: z.array(TestimonyMode).nullable(),
    status: z.array(EvidenceStatus).nullable(),
    fileName: z.string().nullable(),
    fileSize: z.number().int().nullable(),
    metadata: z.record(z.string()).and(z.unknown()).nullable(),
    capturedFrom: z.string().datetime({ offset: true }).nullable(),
    capturedUntil: z.string().datetime({ offset: true }).nullable(),
    collectionMetadata: z.boolean().nullable(),
    page: z.number().int().nullable(),
    size: z.number().int().nullable(),
    sort: z.array(z.string()).nullable(),
  })
  .partial()
  .passthrough();
const SearchEvidenceGroupInfoViewModel = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    type: GroupType,
    code: z.string(),
  })
  .partial()
  .passthrough();
const SearchEvidenceViewModel = z
  .object({
    id: z.string().uuid(),
    caseFileId: z.string().uuid(),
    group: SearchEvidenceGroupInfoViewModel,
    title: z.string(),
    type: z.string(),
    hash: z.string(),
    fileSize: z.number().int(),
    custodyType: z.string(),
    createdBy: z.string(),
    capturedAt: z.string().datetime({ offset: true }),
    fileName: z.string(),
    status: GetEvidenceStatusViewModel,
    timestamps: GetEvidenceTimestampsViewModel,
    metadata: z.record(z.string()).and(z.unknown()),
  })
  .partial()
  .passthrough();
const BaseCollectionViewModel_SearchEvidenceViewModel_ = z
  .object({ records: z.array(SearchEvidenceViewModel), _metadata: Metadata })
  .partial()
  .passthrough();
const SearchEvidenceCollectionViewModel =
  BaseCollectionViewModel_SearchEvidenceViewModel_.and(
    z
      .object({ records: z.array(SearchEvidenceViewModel) })
      .partial()
      .passthrough()
  );
const UpdateEvidenceRequestModel = z
  .object({
    title: z.string(),
    createdBy: z.string().max(50),
    metadata: z.record(z.string()),
    custody: CustodyType,
  })
  .partial()
  .passthrough();
const TestimonyDataQueryModel = z
  .object({ required: z.boolean(), providers: z.array(z.string()) })
  .partial()
  .passthrough();
const UploadUrlTemporaryFileHttpRequestModel = z
  .object({
    caseFileId: z.string().uuid().optional(),
    evidenceGroupId: z.string().uuid().optional(),
    evidenceId: z.string().uuid(),
    createdBy: z.string(),
    title: z.string(),
    capturedAt: z.string().datetime({ offset: true }),
    fileName: z.string(),
    testimony: z.record(TestimonyDataQueryModel),
    requiredTestimonyProviders: z.array(z.string()).optional(),
    metadata: z.record(z.string()).optional(),
  })
  .passthrough();
const ObjectType = z.enum([
  "EVIDENCE",
  "THUMBNAIL",
  "REPORT",
  "REPORT_PACKAGE",
  "TEMPLATE",
  "TEMPORARY_FILE",
  "FONT",
  "NOTIFICATION_ATTACHMENT",
  "SIGN_FILE_ORIGINAL",
  "SIGN_FILE_SIGNED",
  "SCRIBBLE",
  "CONVERTED",
  "NOTICEMAN_EVIDENCE",
]);
const DownloadUrlModel = z
  .object({
    id: z.string().uuid(),
    type: ObjectType,
    url: z.string(),
    expiration: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const CustodyType_1 = z.enum(["INTERNAL", "EXTERNAL"]);
const SignFileRequestModel = z
  .object({
    fileId: z.string().uuid(),
    signName: z.string().min(1),
    custodyType: CustodyType_1,
    filename: z.string().optional(),
    hash: z.string().optional(),
  })
  .passthrough();
const DownloadUrlResponseModel = z
  .object({
    url: z.string(),
    expiration: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const StartMultipartUploadRequestModel = z
  .object({
    caseFileId: z.string().uuid().optional(),
    evidenceGroupId: z.string().uuid().optional(),
    createdBy: z.string(),
    title: z.string().min(1),
    capturedAt: z.string().datetime({ offset: true }),
    testimony: z.record(TestimonyDataQueryModel),
    requiredTestimonyProviders: z.array(z.string()).optional(),
    metadata: z.record(z.string()).optional(),
  })
  .passthrough();
const UploadLinkOutputModel = z
  .object({
    url: z.string(),
    expiration: z.string().datetime({ offset: true }),
  })
  .partial()
  .passthrough();
const FileUploadedRequestModel = z
  .object({
    evidenceId: z.string().uuid(),
    size: z.number().int(),
    computedHash: z.string(),
  })
  .passthrough();
const HashTimestampedRequestModel = z
  .object({
    processId: z.string().uuid(),
    evidenceId: z.string().min(1).uuid(),
    timestampToken: z.string().min(1),
    timestampDate: z.string().min(1).datetime({ offset: true }),
    provider: z.string().min(1),
  })
  .passthrough();
const HashTimestampingFailedRequestModel = z
  .object({ hash: z.string(), provider: z.string().min(1) })
  .passthrough();
const EvidenceGroupSearch = z
  .object({
    caseFileId: z.string().uuid().nullable(),
    id: z.array(z.string().uuid()).nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    status: EvidenceGroupStatus.nullable(),
    type: GroupType.nullable(),
    createdBy: z.string().nullable(),
    metadata: z.record(z.string()).and(z.unknown()).nullable(),
    createdFrom: z.string().datetime({ offset: true }).nullable(),
    createdUntil: z.string().datetime({ offset: true }).nullable(),
    page: z.number().int().nullable(),
    size: z.number().int().nullable(),
    sort: z.array(z.string()).nullable(),
  })
  .partial()
  .passthrough();
const SearchCaseFileRequestModel = z
  .object({
    id: z.array(z.string().uuid()).nullable(),
    code: z.string().nullable(),
    title: z.string().nullable(),
    category: z.array(z.string()).nullable(),
    owner: z.array(z.string()).nullable(),
    status: CaseFileStatus_3.nullable(),
    createdFrom: z.string().datetime({ offset: true }).nullable(),
    createdUntil: z.string().datetime({ offset: true }).nullable(),
    metadata: z.record(z.string()).and(z.unknown()).nullable(),
    page: z.number().int().nullable(),
    size: z.number().int().nullable(),
    sort: z.array(z.string()).nullable(),
  })
  .partial()
  .passthrough();
const SearchEvidenceRequestModel = z
  .object({
    id: z.array(z.string().uuid()).nullable(),
    caseFileId: z.string().uuid().nullable(),
    groupId: z.array(z.string().uuid()).nullable(),
    groupType: z.array(GroupType).nullable(),
    title: z.string().nullable(),
    type: z.string(),
    hash: z.string().nullable(),
    custodyType: CustodyType.nullable(),
    testimonyMode: z.array(TestimonyMode).nullable(),
    status: z.array(EvidenceStatus).nullable(),
    fileName: z.string().nullable(),
    fileSize: z.number().int().nullable(),
    metadata: z.record(z.string()).and(z.unknown()).nullable(),
    capturedFrom: z.string().datetime({ offset: true }).nullable(),
    capturedUntil: z.string().datetime({ offset: true }).nullable(),
    collectionMetadata: z.boolean().nullable(),
    page: z.number().int().nullable(),
    size: z.number().int().nullable(),
    sort: z.array(z.string()).nullable(),
  })
  .partial()
  .passthrough();
const UpdateCaseFilesRequestModel = BulkPatchRequestModel;
const UpdateEvidenceGroupsRequest = BulkPatchRequestModel;
const UpdateEvidencesRequestModel = BulkPatchRequestModel;

export const schemas = {
  CaseFileStatus_3,
  filter,
  CaseFileStatus_1,
  SearchCaseFileViewModel,
  Metadata,
  BaseCollectionViewModel_SearchCaseFileViewModel_,
  SearchCaseFileCollectionViewModel,
  CreateCaseFileRequestModel,
  BulkPatchOperation,
  BulkPatchOperationRequestModel,
  BulkPatchRequestModel,
  CaseFileStatus,
  GetCaseFileViewModel,
  UpdateCaseFileRequestModel,
  GroupType,
  CreateEvidenceGroupRequestModel,
  EvidenceGroupStatus,
  EvidencesCountViewModel,
  EvidenceGroupViewModel,
  UpdateEvidenceGroupRequest,
  CloseEvidenceGroupRequestModel,
  CustodyType,
  TestimonyProviders,
  RegisterEvidenceRequestModel,
  RegisterEvidenceResponseModel,
  GetEvidenceStatusViewModel,
  TspTimestampViewModel,
  DltTimestampViewModel,
  GetEvidenceTimestampsViewModel,
  GetEvidenceViewModel,
  NewUploadUrlRequestModel,
  createUploadUrl_Body,
  ObjectType_1,
  DownloadUrlModel_1,
  RelationshipItemType,
  AssignRelationshipRequestModel,
  EvidenceRequestModel,
  GroupRequestModel,
  DataRequestModel,
  CaseFilePreviewReportRequestModel,
  CaseFileReportRequestModel,
  CaseFileStatusViewModel,
  UpdateCaseFileStatusRequestModel,
  ChatPreviewReportRequestModel,
  ChatSignedReportRequestModel,
  filter__2,
  SearchEvidenceGroupViewModel,
  BaseCollectionViewModel_SearchEvidenceGroupViewModel_,
  SearchEvidenceGroupCollectionViewModel,
  TestimonyMode,
  EvidenceStatus,
  filter__3,
  SearchEvidenceGroupInfoViewModel,
  SearchEvidenceViewModel,
  BaseCollectionViewModel_SearchEvidenceViewModel_,
  SearchEvidenceCollectionViewModel,
  UpdateEvidenceRequestModel,
  TestimonyDataQueryModel,
  UploadUrlTemporaryFileHttpRequestModel,
  ObjectType,
  DownloadUrlModel,
  CustodyType_1,
  SignFileRequestModel,
  DownloadUrlResponseModel,
  StartMultipartUploadRequestModel,
  UploadLinkOutputModel,
  FileUploadedRequestModel,
  HashTimestampedRequestModel,
  HashTimestampingFailedRequestModel,
  EvidenceGroupSearch,
  SearchCaseFileRequestModel,
  SearchEvidenceRequestModel,
  UpdateCaseFilesRequestModel,
  UpdateEvidenceGroupsRequest,
  UpdateEvidencesRequestModel,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/api/v1/private/case-files",
    alias: "search",
    requestFormat: "json",
    parameters: [
      {
        name: "filter",
        type: "Query",
        schema: filter,
      },
    ],
    response: SearchCaseFileCollectionViewModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files",
    alias: "createCaseFile",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateCaseFileRequestModel,
      },
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/private/case-files",
    alias: "updateCaseFiles",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BulkPatchRequestModel,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/case-files/:caseFileId",
    alias: "getCaseFile",
    requestFormat: "json",
    parameters: [
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: GetCaseFileViewModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/private/case-files/:caseFileId",
    alias: "updateCaseFile",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateCaseFileRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Case file not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups",
    alias: "createEvidenceGroup",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CreateEvidenceGroupRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId",
    alias: "getEvidenceGroup",
    requestFormat: "json",
    parameters: [
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: EvidenceGroupViewModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Evidence group not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId",
    alias: "discardGroup",
    requestFormat: "json",
    parameters: [
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Evidence group to discard does not exist`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId",
    alias: "updateEvidenceGroup",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateEvidenceGroupRequest,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Evidence group not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId/close",
    alias: "closeEvidenceGroup",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CloseEvidenceGroupRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId/evidences",
    alias: "registerEvidence",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RegisterEvidenceRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: RegisterEvidenceResponseModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId/evidences/:evidenceId",
    alias: "getEvidence",
    requestFormat: "json",
    parameters: [
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: GetEvidenceViewModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId/evidences/:evidenceId",
    alias: "deleteEvidence",
    requestFormat: "json",
    parameters: [
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId/evidences/:evidenceId/download-url",
    alias: "createDownloadUrl",
    requestFormat: "json",
    parameters: [
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:evidenceGroupId/evidences/:evidenceId/upload-url",
    alias: "createUploadUrl",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: createUploadUrl_Body,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceGroupId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/case-files/:caseFileId/evidence-groups/:groupId/evidences/:evidenceId/thumbnail-url/:thumbnailSize",
    alias: "thumbnailUrl",
    requestFormat: "json",
    parameters: [
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "groupId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "thumbnailSize",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: DownloadUrlModel_1,
    errors: [
      {
        status: 404,
        description: `Thumbnail URL not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files/:caseFileId/relationship",
    alias: "assignRelationship",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: AssignRelationshipRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Case file not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files/:caseFileId/report-preview",
    alias: "obtainReportPreview",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CaseFilePreviewReportRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/case-files/:caseFileId/reports",
    alias: "obtainSignedReport",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: CaseFileReportRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "put",
    path: "/api/v1/private/case-files/:caseFileId/status",
    alias: "updateCaseFileStatus",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateCaseFileStatusRequestModel,
      },
      {
        name: "caseFileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Case file not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/chat/:chatId/report-preview",
    alias: "obtainReportPreview_1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ChatPreviewReportRequestModel,
      },
      {
        name: "chatId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/chat/:chatId/reports",
    alias: "obtainSignedChatReport",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ChatSignedReportRequestModel,
      },
      {
        name: "chatId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/evidence-groups",
    alias: "search_1",
    requestFormat: "json",
    parameters: [
      {
        name: "filter",
        type: "Query",
        schema: filter__2,
      },
    ],
    response: SearchEvidenceGroupCollectionViewModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/private/evidence-groups",
    alias: "updateEvidenceGroups",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BulkPatchRequestModel,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/evidences",
    alias: "search_2",
    requestFormat: "json",
    parameters: [
      {
        name: "filter",
        type: "Query",
        schema: filter__3,
      },
    ],
    response: SearchEvidenceCollectionViewModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/evidences",
    alias: "registerEvidence_1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: RegisterEvidenceRequestModel,
      },
    ],
    response: RegisterEvidenceResponseModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/private/evidences",
    alias: "updateEvidence",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BulkPatchRequestModel,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/evidences/:evidenceId",
    alias: "getEvidence_1",
    requestFormat: "json",
    parameters: [
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: GetEvidenceViewModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Not found`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/private/evidences/:evidenceId",
    alias: "deleteEvidence_1",
    requestFormat: "json",
    parameters: [
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "patch",
    path: "/api/v1/private/evidences/:evidenceId",
    alias: "updateEvidence_1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UpdateEvidenceRequestModel,
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Not Found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/evidences/:evidenceId/download-url",
    alias: "createDownloadUrl_1",
    requestFormat: "json",
    parameters: [
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/evidences/:evidenceId/upload-url",
    alias: "createUploadUrl_1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ fileName: z.string().min(1) }).passthrough(),
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/files",
    alias: "createUploadUrl_2",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: UploadUrlTemporaryFileHttpRequestModel,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/private/reports/:reportId",
    alias: "deleteReport",
    requestFormat: "json",
    parameters: [
      {
        name: "reportId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Report not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/reports/:reportId/document",
    alias: "getReportPdf",
    requestFormat: "json",
    parameters: [
      {
        name: "reportId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: DownloadUrlModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Report not found`,
        schema: z.void(),
      },
      {
        status: 406,
        description: `Request not acceptable, because the report type requested is not valid`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/reports/:reportId/package",
    alias: "getReportZip",
    requestFormat: "json",
    parameters: [
      {
        name: "reportId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: DownloadUrlModel,
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `Report not found`,
        schema: z.void(),
      },
      {
        status: 406,
        description: `Request not acceptable, because the report type requested is not valid`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/sign-file",
    alias: "signFile",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: SignFileRequestModel,
      },
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `Bad request`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/sign-file/:fileId/download-url",
    alias: "createDownloadUrl_2",
    requestFormat: "json",
    parameters: [
      {
        name: "fileId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: DownloadUrlResponseModel,
    errors: [
      {
        status: 404,
        description: `Resource sign file not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/uploads/:evidenceId/:fileName",
    alias: "startMultipartUpload",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: StartMultipartUploadRequestModel,
      },
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "fileName",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 404,
        description: `Resource not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "get",
    path: "/api/v1/private/uploads/:evidenceId/:filename/:uploadId",
    alias: "getLink",
    requestFormat: "json",
    parameters: [
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "filename",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "uploadId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "partNumber",
        type: "Query",
        schema: z.number().int().gte(1).lte(10000),
      },
    ],
    response: UploadLinkOutputModel,
    errors: [
      {
        status: 400,
        description: `If the request parameters or query string is wrong`,
        schema: z.void(),
      },
      {
        status: 404,
        description: `If evidence file upload is not found`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/private/uploads/:evidenceId/:filename/:uploadId",
    alias: "completeMultipartUpload",
    requestFormat: "json",
    parameters: [
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "filename",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "uploadId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "partsCount",
        type: "Query",
        schema: z.number().int().gte(1).lte(10000),
      },
    ],
    response: z.object({}).partial().passthrough(),
    errors: [
      {
        status: 400,
        description: `If the request parameters or query string is wrong`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "delete",
    path: "/api/v1/private/uploads/:evidenceId/:filename/:uploadId",
    alias: "cancelMultipartUpload",
    requestFormat: "json",
    parameters: [
      {
        name: "evidenceId",
        type: "Path",
        schema: z.string().uuid(),
      },
      {
        name: "filename",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "uploadId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 400,
        description: `If the request parameters or query string is wrong`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/webhook/doc-manager/file-uploaded",
    alias: "fileUploaded",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: FileUploadedRequestModel,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
  {
    method: "post",
    path: "/api/v1/webhook/testifier/hash-timestamped",
    alias: "timestamping",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: HashTimestampedRequestModel,
      },
    ],
    response: z.void(),
  },
  {
    method: "post",
    path: "/api/v1/webhook/testifier/hash-timestamping-failed",
    alias: "timestampingFailed",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: HashTimestampingFailedRequestModel,
      },
    ],
    response: z.void(),
    errors: [
      {
        status: 500,
        description: `Unexpected error`,
        schema: z.void(),
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
