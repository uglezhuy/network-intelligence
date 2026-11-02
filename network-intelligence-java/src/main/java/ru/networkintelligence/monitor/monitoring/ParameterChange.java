package ru.networkintelligence.monitor.monitoring;

public class ParameterChange {

    public String name;
    public String oldValue;
    public String newValue;
    public Double differenceDouble;      // разница, если параметр числовой
    public String differenceString;      // текстовое описание, если параметр строковый
    public Double threshold;             // порог, по которому сравнивали

    ParameterChange(String name, String oldValue, String newValue,
                    Double differenceDouble, String differenceString,
                    Double threshold) {
        this.name = name;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.differenceDouble = differenceDouble;
        this.differenceString = differenceString;
        this.threshold = threshold;
    }


    public  static ParameterChange numeric(String name, int oldVal, int newVal, double threshold) {
        int diff = newVal - oldVal;
        return new ParameterChange(
                name,
                String.valueOf(oldVal),       // int → String
                String.valueOf(newVal),       // int → String
                (double) diff,                // int → Double
                null,                         // для чисел текстовой разницы нет
                threshold
        );
    }



    public static ParameterChange text(
            String name,
            String oldVal,
            String newVal
    ) {
        return new ParameterChange(
                name,
                oldVal,
                newVal,
                null,                   // числовой разницы нет
                oldVal + " -> " + newVal, // текстовое описание изменения
                null                    // числового порога нет
        );
    }









}