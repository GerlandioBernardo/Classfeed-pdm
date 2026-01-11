import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ClassTabParamList } from "../types";
import { COLORS, FONT_SIZES } from "../constants";
import { ClassHeader } from "../components/Classes/ClassHeader";

// screens
import ClassFeedbackScreen from "../screens/Classes/ClassFeedbackScreen";
import ClassLessonsScreen from "../screens/Classes/ClassLessonsScreen";
import ClassStudentsScreen from "../screens/Classes/ClassStudentsScreen";

const Tab = createBottomTabNavigator<ClassTabParamList>();

interface ClassTabNavigatorProps {
    route: {
        params: {
            classId: string;
        };
    };
}

export function ClassTabNavigator({ route }: ClassTabNavigatorProps) {
    const { classId } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                header: () => <ClassHeader classId={classId} />,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.text.secondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                },
                tabBarLabelStyle: {
                    fontSize: FONT_SIZES.sm,
                    fontWeight: "600",
                },
            }}
        >
            <Tab.Screen
                name="Feedback"
                component={ClassFeedbackScreen}
                initialParams={{ classId }}
                options={{
                    tabBarIcon: ({ color }) => <TabIcon name="📊" color={color} />,
                }}
            />
            <Tab.Screen
                name="Lessons"
                component={ClassLessonsScreen}
                initialParams={{ classId }}
                options={{
                    tabBarLabel: "Aulas",
                    tabBarIcon: ({ color }) => <TabIcon name="📝" color={color} />,
                }}
            />
            <Tab.Screen
                name="Students"
                component={ClassStudentsScreen}
                initialParams={{ classId }}
                options={{
                    tabBarLabel: "Alunos",
                    tabBarIcon: ({ color }) => <TabIcon name="👥" color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

function TabIcon({ name, color }: { name: string; color: string }) {
    return <Text style={{ fontSize: 24 }}>{name}</Text>;
}
