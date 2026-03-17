

1️⃣ Final System Architecture

Your platform is now a Multi-Tenant ZenML Control Plane.

flowchart TD

User[User / J&J User]

CP[Control Plane API<br>Node.js + Express]

Auth[JWT Authentication]
RBAC[RBAC Middleware]
Audit[Audit Logger]

Proxy[ZenML Proxy Gateway]

DB[(MongoDB)]

Docker[(Docker Engine)]

Zen1[ZenML Server Tenant A]
Zen2[ZenML Server Tenant B]

User --> CP

CP --> Auth
Auth --> RBAC
RBAC --> Audit

CP --> Proxy
Proxy --> Zen1
Proxy --> Zen2

CP --> DB

CP --> Docker
Docker --> Zen1
Docker --> Zen2


---

2️⃣ Workspace Provisioning Flow (Latest)

This reflects the new CLI-based bootstrap method.

sequenceDiagram

participant Admin
participant ControlPlane
participant Docker
participant ZenML
participant MongoDB

Admin->>ControlPlane: POST /workspaces

ControlPlane->>Docker: Start ZenML container

Docker-->>ZenML: Container running

ControlPlane->>ZenML: GET /api/v1/info

ControlPlane->>Docker: zenml init

ControlPlane->>Docker: zenml connect --url http://localhost:PORT

ControlPlane->>Docker: zenml service-account create control-plane

Docker-->>ControlPlane: API Key (ZENKEY_...)

ControlPlane->>MongoDB: Save workspace + API key

ControlPlane-->>Admin: Workspace ready

Key highlight for demo:

> The control plane automatically provisions a fully configured ZenML server with an API key.




---

3️⃣ User Provisioning Flow

sequenceDiagram

participant Admin
participant ControlPlane
participant ZenML
participant MongoDB

Admin->>ControlPlane: Add user to workspace

ControlPlane->>MongoDB: Create Control Plane user

ControlPlane->>ZenML: Create ZenML user

ZenML-->>ControlPlane: zenmlUserId

ControlPlane->>MongoDB: Store workspace membership

ControlPlane-->>Admin: User added successfully


---

4️⃣ Authentication Flow

sequenceDiagram

participant User
participant ControlPlane
participant MongoDB

User->>ControlPlane: POST /auth/login

ControlPlane->>MongoDB: Validate user

MongoDB-->>ControlPlane: User + workspaces

ControlPlane-->>User: Workspace list

User->>ControlPlane: POST /auth/select-workspace

ControlPlane-->>User: JWT Token

JWT payload contains:

userId
workspaceId
role


---

5️⃣ ZenML API Proxy Flow

sequenceDiagram

participant User
participant ControlPlane
participant ZenML

User->>ControlPlane: POST /proxy/runs

ControlPlane->>ControlPlane: Verify JWT

ControlPlane->>ControlPlane: RBAC Check

ControlPlane->>ZenML: POST /api/v1/pipeline_runs
Authorization: Bearer ZENKEY_xxx

ZenML-->>ControlPlane: Run created

ControlPlane-->>User: Response

Important design point:

> The control plane injects the ZenML API key automatically, so clients never interact with ZenML directly.




---

6️⃣ Audit Logging Flow

sequenceDiagram

participant User
participant ControlPlane
participant ZenML
participant MongoDB

User->>ControlPlane: API Request

ControlPlane->>ZenML: Forward request

ZenML-->>ControlPlane: Response

ControlPlane->>MongoDB: Store audit log

ControlPlane-->>User: Response

Stored audit log example:

User: john@jnj.com
Workspace: jnj-tenant-1
Action: POST /proxy/runs
Status: 200
Time: 12:42


---

7️⃣ Full End-to-End Request Flow

flowchart TD

Login[User Login]
WorkspaceSelect[Select Workspace]
JWT[JWT Token Issued]

ProxyRequest[API Request /proxy]

RBACCheck[RBAC Permission Check]

AuditLog[Audit Logging]

ZenMLCall[Call ZenML API]

Response[Return Response]

Login --> WorkspaceSelect
WorkspaceSelect --> JWT
JWT --> ProxyRequest
ProxyRequest --> RBACCheck
RBACCheck --> AuditLog
AuditLog --> ZenMLCall
ZenMLCall --> Response


---

8️⃣ POC Demo Walkthrough

Here is the exact sequence you should follow in your demo.


---

Step 1 — Start Control Plane

Run:

node src/app.js

Explain:

> The control plane manages tenants, users, authentication, RBAC, and ZenML API routing.




---

Step 2 — Create Workspace

API:

POST /workspaces

Body:

{
 "name": "jnj-tenant-1"
}

Explain:

Control plane automatically:
1. Starts a ZenML container
2. Connects using CLI
3. Creates service account
4. Stores API key

Show MongoDB record.


---

Step 3 — Add User

API:

POST /workspace-users/:workspaceId

Body:

{
 "email": "john@jnj.com",
 "role": "ml_engineer"
}

Explain:

User is created both in
Control Plane + ZenML workspace.


---

Step 4 — Login

POST /auth/login

Explain:

User identity verified
Workspaces returned


---

Step 5 — Select Workspace

POST /auth/select-workspace

Response:

JWT token


---

Step 6 — Run ZenML API

Example:

POST /proxy/runs
Authorization: Bearer JWT

Explain:

Control plane:
1. validates JWT
2. checks RBAC
3. injects ZenML API key
4. forwards request


---

Step 7 — Show Audit Logs

GET /audit/workspace/:workspaceId

Explain:

Platform tracks all operations.


---


Master Architecture Diagram — ZenML Control Plane

flowchart LR

%% USERS
User[Enterprise User<br>J&J UsPLANE%% CONTROL PLANE
subgraph ControlPlane["Control Plane (Node.js)"]

API[API Gateway<br>Express Server]

Auth[JWT Authentication]

RBAC[RBAC Authorization]

Audit[Audit Logging]

WorkspaceService[Workspace Provisioning Service]

UserService[User Provisioning Service]

Proxy[ZenML Proxy Gateway]

DB[(MongoDB)]

end

%% INFRASTRUCTURE
subgraph Infra["Infrastructure"]

Docker[(Docker Engine)]

Zen1[ZenML Tenant Server A]

Zen2[ZenML Tenant Server B]

end

%% USER FLOW
User --> API

API --> Auth
Auth --> RBAC
RBAC --> Audit

%% CONTROL PLANE SERVICES
API --> WorkspaceService
API --> UserService
API --> Proxy

%% DATABASE
WorkspaceService --> DB
UserService --> DB
Auth --> DB
Audit --> DB

%% DOCKER PROVISIONING
WorkspaceService --> Docker

Docker --> Zen1
Docker --> Zen2

%% PROXY ROUTING
Proxy --> Zen1
Proxy -->flowchartwchartchart
