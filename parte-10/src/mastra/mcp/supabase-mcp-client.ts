import { MCPClient } from '@mastra/mcp'

export const supabaseMcpClient = new MCPClient({
  id: 'supabase-mcp-client',
  servers: {
    supabase: {
      url: new URL('https://mcp.supabase.com/mcp?project_ref=fnyrhlsadijoxketeskx'),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_PERSONAL_ACCESS_TOKEN}`,
        },
      },
    },
  },
})