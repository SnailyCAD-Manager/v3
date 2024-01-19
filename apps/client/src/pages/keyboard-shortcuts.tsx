import CustomCard from "@/components/ui/CustomCard";
import { Kbd, Table } from "@mantine/core";

export default function KeyboardShortcutsPage() {
    return (
        <CustomCard>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Shortcut</Table.Th>
                        <Table.Th>Action</Table.Th>
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td>
                            <Kbd>Ctrl</Kbd> + <Kbd>L</Kbd>
                        </Table.Td>
                        <Table.Td>Clear logs</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td>
                            <Kbd>Ctrl</Kbd> + <Kbd>D</Kbd>
                        </Table.Td>
                        <Table.Td>Quick jump to Dashboard</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Td>
                            <Kbd>Ctrl</Kbd> + <Kbd>R</Kbd>
                        </Table.Td>
                        <Table.Td>Start current instance</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>
                            <Kbd>Ctrl</Kbd> + <Kbd>T</Kbd>
                        </Table.Td>
                        <Table.Td>Stop current instance</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </CustomCard>
    );
}
