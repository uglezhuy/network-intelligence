import { DashboardService } from './dashboard.service.js';
import { Controller, Get, Param, Patch, Delete, Post, Body, Query } from '@nestjs/common';


@Controller()
export class DashboardController {




    constructor(
        private readonly dashboardService: DashboardService,
    ) { }



    // данные о сканах монитрое и событиях на главном экране
    @Get('dashboard/:userId')
    getDashboard(@Param('userId') userId: string) {

        return this.dashboardService.getDashboard((userId));




    }






}





