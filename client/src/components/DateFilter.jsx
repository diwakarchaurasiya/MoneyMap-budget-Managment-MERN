import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calendar, X } from "lucide-react";

const DateFilter = ({ startDate, endDate, onFilterChange, onClearFilters }) => {
  const handleStartDateChange = (e) => {
    onFilterChange({ startDate: e.target.value });
  };

  const handleEndDateChange = (e) => {
    onFilterChange({ endDate: e.target.value });
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Date Filter</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <div className="flex items-end">
            <Button variant="outline" onClick={handleClear} className="w-full">
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateFilter;
