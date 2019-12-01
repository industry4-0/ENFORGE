export class manufacturingPlans{
    id: string;
    customerId: string;
    orderNumber?: string;
    statusHistory?: any[];
    title: string;
    items: any[];
    generated_at?: Date;
    created_at?: Date;
    deletedItems?: any;
}