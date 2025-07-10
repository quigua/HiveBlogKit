# Bridge API Responses Documentation

## Method: `bridge.list_all_subscriptions`

**Endpoint:** `https://api.hive.blog` (and other compatible Hive nodes)

**Description:** Retrieves a list of all communities a given Hive user is subscribed to, along with their role in each community.

**Request Parameters:**
- `jsonrpc`: "2.0"
- `method`: "bridge.list_all_subscriptions"
- `params`: `["username"]` (where `username` is the Hive account name)
- `id`: (any unique identifier, e.g., 1)

**Example Request (for user 'quigua'):**
```json
{
  "jsonrpc": "2.0",
  "method": "bridge.list_all_subscriptions",
  "params": ["quigua"],
  "id": 1
}
```

**Example Response (for user 'quigua'):**
```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    ["hive-13323","Splinterlands","guest",""],
    ["hive-139531","HiveDevs","guest",""],
    ["hive-184309","THGaming","guest",""],
    ["hive-131619","Blockchain Gaming","guest",""],
    ["hive-169321","Programming & Dev","guest",""],
    ["hive-154226","Develop Spanish","guest",""]
  ]
}
```

**Response Structure Analysis:**

The `result` field is a JSON array (list) where each element is another array (list) representing a single community subscription. Each inner array contains four elements in the following order:

1.  **Community ID (string):** A unique identifier for the community (e.g., `"hive-13323"`).
2.  **Community Name (string):** The human-readable name of the community (e.g., `"Splinterlands"`).
3.  **User Role (string):** The role of the subscribed user within that community (e.g., `"guest"`). Common roles might include `"guest"`, `"member"`, `"mod"`, `"admin"`, etc.
4.  **Additional Field (string, often empty):** This field appears to be reserved or currently unused, often returning an empty string (`""`). It might be intended for a specific title or additional metadata related to the subscription in the future.

**Interpretation for Library Development:**

To extract community subscriptions, the library should parse the `result` array. For each inner array, it can map the elements to meaningful keys such as `community_id`, `community_name`, `user_role`, and `additional_info` (or similar). This structure is straightforward for direct mapping into data objects or dictionaries within the library.
